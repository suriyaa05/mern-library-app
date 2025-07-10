// App.jsx
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import './index.css';
import { FiSearch } from 'react-icons/fi';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBooks = async () => {
    setLoading(true);
    const res = await axios.get('http://localhost:5000/books');
    setBooks(res.data);
    setLoading(false);
  };

  const addBook = async () => {
    if (!title || !author || !rating) return toast.error("Please fill all fields.");
    await axios.post('http://localhost:5000/books', { title, author, rating });
    toast.success("Book added!");
    setTitle('');
    setAuthor('');
    setRating('');
    getBooks();
  };

  const deleteBook = async (id) => {
    await axios.delete(`http://localhost:5000/books/${id}`);
    toast.success("Book deleted!");
    getBooks();
  };

  const startEdit = (book) => {
    setEditingId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setRating(book.rating);
  };

  const saveEdit = async () => {
    if (!title || !author || !rating) return toast.error("Please fill all fields.");
    await axios.put(`http://localhost:5000/books/${editingId}`, { title, author, rating });
    toast.success("Book updated!");
    setTitle('');
    setAuthor('');
    setRating('');
    setEditingId(null);
    getBooks();
  };

  const toggleRead = async (id) => {
    await axios.put(`http://localhost:5000/books/${id}/toggle-read`);
    toast("Book status changed", { icon: "🔁" });
    getBooks();
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-screen min-h-[160vh] bg-[#fdf6f0] text-[#473c33] flex justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          <div className="flex justify-between items-center mb-20">
            <h1 className="text-4xl font-extrabold text-[#473c33] flex items-center gap-2">
              <span role="img" aria-label="book">📚</span> My Favorite Library
            </h1>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full bg-white border border-[#d7b8aa] placeholder-[#a59083] focus:outline-none focus:ring-2 focus:ring-[#d7b8aa]"
              />
              <FiSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#a59083] pointer-events-none" />
            </div>
          </div>

          {/* Highlighted Add Book Section */}
          <div className="mt-[12rem] bg-gradient-to-br from-[#ffc5b9] via-[#ffe5dc] to-[#ffcfcf] rounded-[2rem] shadow-2xl p-16 flex flex-col items-center gap-8 mb-28 border border-[#f8c9b8]">
            <h2 className="text-4xl font-black text-[#473c33] mb-2">📖 Add a New Book</h2>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-96 px-6 py-4 rounded-full bg-white border border-[#d7b8aa] text-[#473c33] shadow-md text-lg"
            />
            <input
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-96 px-6 py-4 rounded-full bg-white border border-[#d7b8aa] text-[#473c33] shadow-md text-lg"
            />
            <input
              placeholder="Rating (1-5)"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-96 px-6 py-4 rounded-full bg-white border border-[#d7b8aa] text-[#473c33] shadow-md text-lg"
            />
            {editingId ? (
              <button
                onClick={saveEdit}
                className="bg-[#d7b8aa] hover:bg-[#c6a895] px-10 py-4 rounded-full text-white font-bold text-lg shadow-md"
              >
                Save
              </button>
            ) : (
              <button
                onClick={addBook}
                className="bg-[#f8c9b8] hover:bg-[#f4bca9] px-10 py-4 rounded-full text-white font-bold text-lg shadow-md"
              >
                Add
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-center text-[#a59083] mb-16">Loading books...</p>
          ) : (
            <ul className="space-y-4">
              {books
                .filter(book =>
                  book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  book.author.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(book => (
                  <li
                    key={book._id}
                    className="w-full bg-white hover:shadow-lg transition-all duration-200 p-5 rounded-xl border border-[#e9dcd3] flex justify-between items-center"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                      <div>
                        <p className="font-semibold text-lg">{book.title}</p>
                        <p className="text-sm text-[#7d5a50]">by {book.author}</p>
                        <p className="text-xs text-[#aa7356]">⭐ Rating: {book.rating}/5</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleRead(book._id)}
                        className="text-[#6b4e44] hover:text-[#4c3b34] text-sm"
                      >
                        {book.read ? '📖 Unread' : '✅ Read'}
                      </button>
                      <button
                        onClick={() => startEdit(book)}
                        className="text-[#aa7356] hover:text-[#905f49]"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteBook(book._id)}
                        className="text-[#b94e4e] hover:text-[#9d3939]"
                      >
                        ❌
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
