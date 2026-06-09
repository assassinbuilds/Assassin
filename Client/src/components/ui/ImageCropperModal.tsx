import React, { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import getCroppedImg from '@/utils/cropImage';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => Promise<void>;
  aspectRatio: number;
  title?: string;
}

export function ImageCropperModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio,
  title = 'Crop Image',
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      if (croppedImage) {
        await onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      onClose(); // Assuming onClose is safe to call after success
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[400px] bg-slate-900 rounded-md overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        
        <div className="flex flex-col gap-2 mt-4 px-2">
          <label className="text-sm font-medium text-slate-700">Zoom</label>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(val) => setZoom(val[0])}
            disabled={isProcessing}
          />
        </div>

        <DialogFooter className="mt-6 flex sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing} className="min-w-[120px]">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isProcessing ? 'Processing...' : 'Apply Crop'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
