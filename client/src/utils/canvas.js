// Draw only the image (used for live preview)
export function drawImageOnlyOnCanvas(canvas, image) {
  if (!canvas || !image) return;
  const ctx = canvas.getContext("2d");

  canvas.width = Math.min(image.width, 600);
  canvas.height = Math.min(image.height, 600);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

// Draw image + text (used for download/export)
export function drawMemeOnCanvas(canvas, image, texts) {
  if (!canvas || !image) return;
  const ctx = canvas.getContext("2d");

  canvas.width = Math.min(image.width, 600);
  canvas.height = Math.min(image.height, 600);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  texts.forEach((t) => {
    ctx.font = `${t.fontWeight} ${t.fontSize}px Arial`;
    ctx.fillStyle = t.color;
    ctx.lineWidth = t.strokeWidth;
    ctx.strokeStyle = t.stroke;
    ctx.textBaseline = "top";
    ctx.strokeText(t.content, t.x, t.y);
    ctx.fillText(t.content, t.x, t.y);
  });
}

// For videos — still draws text on top of video frames
export function drawMemeOnVideo(canvas, texts) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  texts.forEach((t) => {
    ctx.font = `${t.fontWeight} ${t.fontSize}px Arial`;
    ctx.fillStyle = t.color;
    ctx.lineWidth = t.strokeWidth;
    ctx.strokeStyle = t.stroke;
    ctx.textBaseline = "top";
    ctx.strokeText(t.content, t.x, t.y);
    ctx.fillText(t.content, t.x, t.y);
  });
}
