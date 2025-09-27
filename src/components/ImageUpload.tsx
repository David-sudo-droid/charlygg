import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image as ImageIcon, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  url?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 10 
}) => {
  const [localImages, setLocalImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Convert base64 to blob for upload simulation
  const base64ToBlob = (base64: string): Blob => {
    const parts = base64.split(',');
    const contentType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
  };

  // Simulate upload to a cloud service (placeholder for real implementation)
  const uploadToCloudService = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // In a real implementation, you would upload to Cloudinary, AWS S3, etc.
        // For now, we'll use data URLs as placeholders
        setTimeout(() => {
          resolve(e.target?.result as string);
        }, 1500); // Simulate upload delay
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (files: FileList) => {
    const totalImages = images.length + localImages.length + files.length;
    
    if (totalImages > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select only image files",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select images smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const id = `${Date.now()}-${Math.random()}`;
      const preview = URL.createObjectURL(file);
      
      const newImage: ImageFile = {
        id,
        file,
        preview,
        uploading: true,
      };

      setLocalImages(prev => [...prev, newImage]);

      // Start upload
      uploadToCloudService(file)
        .then((url) => {
          setLocalImages(prev => prev.map(img => 
            img.id === id ? { ...img, uploading: false, url } : img
          ));
          
          // Add to the main images array
          onImagesChange([...images, url]);
        })
        .catch((error) => {
          console.error('Upload failed:', error);
          setLocalImages(prev => prev.filter(img => img.id !== id));
          toast({
            title: "Upload failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
        });
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const removeImage = (index: number, isLocal = false) => {
    if (isLocal) {
      const imageToRemove = localImages[index];
      URL.revokeObjectURL(imageToRemove.preview);
      setLocalImages(prev => prev.filter((_, i) => i !== index));
      
      if (imageToRemove.url) {
        onImagesChange(images.filter(img => img !== imageToRemove.url));
      }
    } else {
      onImagesChange(images.filter((_, i) => i !== index));
    }
  };

  const totalImages = images.length + localImages.length;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop images here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF, WebP • Max size: 5MB • Max {maxImages} images
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={totalImages >= maxImages}
              >
                <Plus className="w-4 h-4 mr-2" />
                Select Images
              </Button>
              
              {totalImages > 0 && (
                <Badge variant="secondary">
                  {totalImages} / {maxImages} images
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelect(e.target.files);
          }
        }}
      />

      {/* Image Preview Grid */}
      {(images.length > 0 || localImages.length > 0) && (
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center">
            <ImageIcon className="w-4 h-4 mr-2" />
            Uploaded Images ({totalImages})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Existing images */}
            {images.map((image, index) => (
              <div key={`existing-${index}`} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden border">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling!.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}

            {/* Local uploading images */}
            {localImages.map((imageFile, index) => (
              <div key={`local-${imageFile.id}`} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden border">
                  <img
                    src={imageFile.preview}
                    alt={`Uploading ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {imageFile.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        <p className="text-xs">Uploading...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index, true)}
                  disabled={imageFile.uploading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
