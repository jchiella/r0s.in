document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = form.elements['url'].value;

    console.log(url);

    const response = await fetch('/api/links', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    const { slug } = await response.json();

    form.elements['url'].value = `r0s.in/${slug}`;
  });
});