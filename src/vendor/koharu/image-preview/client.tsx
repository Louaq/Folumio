import { createRoot } from "react-dom/client";
import ImageLightbox from "./ImageLightbox";
import { openImage, closeModal, type ImageLightboxData } from "./modal";

const host = document.createElement("div");
host.dataset.imageViewer = "";
document.body.append(host);
createRoot(host).render(<ImageLightbox />);

export function open(data: ImageLightboxData) {
	openImage(data);
}
export const close = closeModal;
