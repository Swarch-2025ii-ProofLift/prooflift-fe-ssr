'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"

interface DeleteConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  title?: string
  description?: string
  type?: "post" | "comment"
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  title,
  description,
  type = "post",
}: DeleteConfirmModalProps) {
  const defaultTitle =
    type === "post" ? "¿Eliminar publicación?" : "¿Eliminar comentario?"
  const defaultDescription =
    type === "post"
      ? "Esta acción no se puede deshacer. La publicación será eliminada permanentemente."
      : "Esta acción no se puede deshacer. El comentario será eliminado permanentemente."

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-left">
              {title || defaultTitle}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left pt-2">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
