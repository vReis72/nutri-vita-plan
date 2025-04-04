
import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ProgressPhoto {
  id: string;
  url: string;
  date: Date;
  caption?: string;
}

interface ProgressPhotosViewerProps {
  photos: ProgressPhoto[];
  patientName: string;
}

const ProgressPhotosViewer: React.FC<ProgressPhotosViewerProps> = ({ photos, patientName }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sortedPhotos = [...photos].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handlePrevious = () => {
    setZoomLevel(1);
    setCurrentPhotoIndex((prev) => (prev === 0 ? sortedPhotos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setZoomLevel(1);
    setCurrentPhotoIndex((prev) => (prev === sortedPhotos.length - 1 ? 0 : prev + 1));
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const currentPhoto = sortedPhotos[currentPhotoIndex];
  
  if (photos.length === 0) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Fotos de progresso ({photos.length})</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="font-display">
            Progresso de {patientName} - {photos.length} fotos
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row h-[70vh]">
          <div className="w-full md:w-1/4 border-r overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900/50">
            <div className="space-y-2">
              {sortedPhotos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className={cn(
                    "rounded-md overflow-hidden cursor-pointer transition-all border-2",
                    currentPhotoIndex === index 
                      ? "border-nutri-primary ring-2 ring-nutri-primary/20" 
                      : "border-transparent hover:border-gray-200"
                  )}
                  onClick={() => {
                    setCurrentPhotoIndex(index);
                    setZoomLevel(1);
                  }}
                >
                  <div className="aspect-square relative">
                    <img 
                      src={photo.url} 
                      alt={photo.caption || `Foto ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate">
                      {new Date(photo.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 relative flex flex-col">
            <div className="flex-1 flex items-center justify-center bg-black/5 dark:bg-black/40 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhotoIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <div 
                    className="overflow-auto max-w-full max-h-full" 
                    style={{ 
                      cursor: zoomLevel > 1 ? "move" : "default"
                    }}
                  >
                    <img
                      src={currentPhoto.url}
                      alt={currentPhoto.caption || `Foto ${currentPhotoIndex + 1}`}
                      className="transform transition-transform duration-200"
                      style={{ 
                        transformOrigin: "center",
                        transform: `scale(${zoomLevel})`,
                        maxWidth: "100%",
                        maxHeight: "100%"
                      }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="p-3 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {currentPhotoIndex + 1} / {sortedPhotos.length}
                </span>
                <Button variant="outline" size="sm" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm">
                {new Date(currentPhoto.date).toLocaleDateString('pt-BR')}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-12 text-center">{zoomLevel}x</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {currentPhoto.caption && (
              <div className="px-4 py-2 border-t bg-gray-50 dark:bg-gray-900/50 text-sm">
                {currentPhoto.caption}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-3 border-t flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" />
              Fechar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressPhotosViewer;
