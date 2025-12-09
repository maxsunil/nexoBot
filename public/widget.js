

(function() {
  const script = document.currentScript;
  const publicId = script.getAttribute('data-chat-id');
  
  if (!publicId) {
    console.error('Chatbot widget: Missing data-chat-id attribute');
    return;
  }

  const iframe = document.createElement('iframe');
  const baseUrl = 'http://192.168.1.9:3000';
  iframe.src = `${baseUrl}/embed/${publicId}`;
  
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';
  iframe.style.right = '20px';
  iframe.style.width = '90px'; 
  iframe.style.height = '90px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '2147483647';
  iframe.style.background = 'transparent';
  iframe.style.transition = 'width 0.3s ease, height 0.3s ease';
  iframe.style.overflow = 'hidden';

  document.body.appendChild(iframe);

  window.addEventListener('message', function(event) {
    // Security check: ensure message comes from our domain
    if (event.origin !== baseUrl) return;

    if (event.data.type === 'CHATBOT_RESIZE') {
      if (event.data.isOpen) {
        // Open state
        iframe.style.width = '400px';
        iframe.style.height = '600px';
        iframe.style.bottom = '0';
        iframe.style.right = '0';
      } else {
        // Closed state
        iframe.style.width = '90px';
        iframe.style.height = '90px';
        iframe.style.bottom = '20px';
        iframe.style.right = '20px';
      }
    }
  });
})();
