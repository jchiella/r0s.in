document.addEventListener('DOMContentLoaded', () => {
  const beforeForm = document.querySelector('form.before');
  const afterForm = document.querySelector('form.after');

  beforeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = beforeForm.elements['url'].value;

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
    afterForm.elements['url'].value = `r0s.in/${slug}`;

    beforeForm.style.display = 'none';
    afterForm.style.display = 'block';
  });

  document.querySelector('button.copy').addEventListener('click', (e) => {

  });

  document.querySelector('button.shortenAnother').addEventListener('click', (e) => {
    e.preventDefault();

    beforeForm.elements['url'].value = '';
    afterForm.elements['url'].value = '';

    afterForm.style.display = 'none';
    beforeForm.style.display = 'block';
  });
});