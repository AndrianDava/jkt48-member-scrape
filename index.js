const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

const url = 'https://jkt48.com/member/list?lang=id';
const baseUrl = 'https://jkt48.com';

let membersList = [];

// Fetch data dari halaman JKT48 dan simpan dalam membersList
axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('.col-4.col-lg-2').each((index, element) => {
      const name = $(element).find('.entry-member__name a').text().trim().replace('\n', ' ');
      const image = $(element).find('img').attr('src');
      const fullImageUrl = baseUrl + image;
      const link = $(element).find('.entry-member__name a').attr('href');
      const fullLinkUrl = baseUrl + link;

      membersList.push({ name, image: fullImageUrl, link: fullLinkUrl });
    });

    console.log('Data anggota JKT48 telah dimuat.');
  })
  .catch(error => {
    console.error('Error fetching member list:', error.message);
  });

// Endpoint untuk pencarian anggota berdasarkan nama
app.get('/search', (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Parameter query tidak ditemukan.' });
  }

  const searchResults = searchMemberByName(query);
  res.json(searchResults);
});

// Fungsi untuk mencari anggota berdasarkan nama
function searchMemberByName(query) {
  query = query.trim().toLowerCase();
  return membersList.filter(member =>
    member.name.toLowerCase().includes(query)
  );
}

// Jalankan server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
