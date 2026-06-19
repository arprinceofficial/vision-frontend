export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // result is like: data:<mime>;base64,AAAA...
      resolve(String(reader.result || ''));
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
