'use client';
import { useState, useEffect } from 'react';

type Book = {
  id: number;
  title: string;
  author: string;
  review?: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [reviews, setReviews] = useState<Record<number, string>>({});


  // Hämta böcker när sidan laddas
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await fetch('http://localhost:5205/books');
    const data = await res.json();
    setBooks(data);
  };

  const addBook = async () => {
    if (!title || !author) return;
    await fetch('http://localhost:5205/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author }),
    });
    setTitle('');
    setAuthor('');
    fetchBooks();
  };

  const deleteBook = async (id: number) => {
    await fetch(`http://localhost:5205/books/${id}`, {
      method: 'DELETE',
    });
    fetchBooks();
  };

  const updateReview = async (id: number) => {
    const review = reviews[id];
    if (!review) return;
  
    await fetch(`http://localhost:5205/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review }),
    });
  
    // Töm recensionen i fältet (för den boken)
    setReviews((prev) => ({ ...prev, [id]: '' }));
    fetchBooks();
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📚 Boklista</h1>

      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Författare"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          onClick={addBook}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lägg till bok
        </button>
      </div>

      <ul className="space-y-4">
        {books.map((book) => (
          <li key={book.id} className="border p-4 rounded shadow-sm">
            <div className="font-semibold text-lg">{book.title}</div>
            <div className="text-gray-700 mb-2">av {book.author}</div>
            <div className="mb-2">
              <strong>Recension:</strong>{' '}
              {book.review ? book.review : <span className="text-gray-400">Ingen ännu</span>}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Skriv recension..."
                value={reviews[book.id] || ''}
                onChange={(e) =>
                setReviews((prev) => ({ ...prev, [book.id]: e.target.value }))
                }

                className="border p-1 flex-1"
              />
              <button
                onClick={() => updateReview(book.id)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                💬
              </button>
              <button
                onClick={() => deleteBook(book.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
