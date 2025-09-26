import React, { useState, useEffect } from "react";
import { mockNotes as initialNotes } from "../utils/mockData";
import { useNavigate } from "react-router-dom";
import {
  FaRegTrashAlt,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaFolder,
  FaEllipsisH,
  FaThumbtack,
  FaTags,
  FaHashtag,
  FaLayerGroup,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  // --- State ---
  const [notes, setNotes] = useState(initialNotes);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [history, setHistory] = useState([]);
  const [trash, setTrash] = useState([]);
  const [showNewNoteBox, setShowNewNoteBox] = useState(initialNotes.length > 0);
  const [noteMenu, setNoteMenu] = useState(null);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [showAddTag, setShowAddTag] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Tag / Category inputs
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagValue, setTagValue] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");

  // Pagination / Sorting
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 6;

  // User / New Note
  const [username, setUsername] = useState("User");
  const [newNote, setNewNote] = useState({
    author: username,
    category: "Work",
    content: "",
    tags: [],
  });
  const [categories, setCategories] = useState([]);

  // คำนวณหมวดหมู่ที่ไม่ซ้ำกัน
  useEffect(() => {
    const uniqueCategories = [...new Set(notes.map((n) => n.category))];
    setCategories(uniqueCategories);
  }, [notes]);

  //ถ้าเปลี่ยนแท็บหรือค้นหา จะรีเซ็ตหน้าเป็นหน้า 1
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  //อัปเดตผู้สร้างโน้ตใหม่
  useEffect(() => {
    setNewNote((prev) => ({ ...prev, author: username }));
  }, [username]);

  // --- Handlers ---
  const handleSaveUsername = () => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => ({ ...note, author: username }))
    );
  };

  const allTags = [...new Set(notes.flatMap((n) => n.tags))];
  const suggestedTags = search.startsWith("#")
    ? allTags.filter((tag) => tag.includes(search.slice(1)))
    : [];

  const handleAddNote = () => {
    if (!newNote.content.trim()) return;
    const nextId = Math.max(0, ...notes.map((n) => n.id)) + 1;
    setNotes([
      {
        ...newNote,
        id: nextId,
        createdAt: new Date().toISOString(),
        lastEditedAt: null,
        author: username,
      },
      ...notes,
    ]);
    setNewNote({ author: username, category: "Work", content: "", tags: [] });
    setShowNewNoteBox(true);
    setCurrentPage(1);
  };

  const handleDeleteNote = (id) => {
    const noteToDelete = notes.find((n) => n.id === id);
    if (!noteToDelete) return;
    setTrash((prev) => [
      ...prev,
      {
        ...noteToDelete,
        deletedAt: new Date().toISOString(),
        deletedBy: username,
      },
    ]);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setPinnedNotes((prev) => prev.filter((pId) => pId !== id));
    if (notes.length === 1) setShowNewNoteBox(false);
  };

  const handleEditNote = (note) => setEditingNote(note);
  const handleSaveEdit = () => {
    const oldNote = notes.find((n) => n.id === editingNote.id);
    setNotes((prevNotes) =>
      prevNotes.map((n) =>
        n.id === editingNote.id
          ? {
              ...n,
              content: editingNote.content,
              lastEditedAt: new Date().toISOString(),
              author: username,
            }
          : n
      )
    );
    setHistory((prev) => [
      ...prev,
      {
        id: editingNote.id,
        oldContent: oldNote.content,
        newContent: editingNote.content,
        editedAt: new Date().toISOString(),
        editedBy: username,
      },
    ]);
    setEditingNote(null);
  };
  const handleCancelEdit = () => setEditingNote(null);

  const handleAddTag = (noteId) => {
    if (!tagValue.trim()) {
      setShowTagInput(false);
      return;
    }
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, tags: [...n.tags, tagValue.trim()] } : n
      )
    );
    setTagValue("");
    setShowTagInput(false);
  };

  const handleAddCategory = (noteId) => {
    if (!categoryValue.trim()) {
      setShowCategoryInput(false);
      return;
    }
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, category: categoryValue.trim() } : n
      )
    );
    setCategoryValue("");
    setShowCategoryInput(false);
  };

  const handlePinNote = (noteId) => {
    setPinnedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [noteId, ...prev]
    );
    setNoteMenu(null);
  };

  // Filter + Sort
  const filteredNotes = notes
    .filter((n) => activeTab === "All" || n.category === activeTab)
    .filter((n) => {
      const lowerCaseSearch = search.toLowerCase();
      return (
        !search ||
        (search.startsWith("#")
          ? n.tags.some((tag) =>
              tag.toLowerCase().includes(lowerCaseSearch.slice(1))
            )
          : false) ||
        n.content.toLowerCase().includes(lowerCaseSearch) ||
        n.author.toLowerCase().includes(lowerCaseSearch)
      );
    });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const aPinned = pinnedNotes.includes(a.id),
      bPinned = pinnedNotes.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    if (sortOption === "Oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOption === "A-Z")
      return a.content.localeCompare(b.content, "th", { sensitivity: "base" });
    if (sortOption === "Z-A")
      return b.content.localeCompare(a.content, "th", { sensitivity: "base" });
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const getCategoryColor = (category) => {
    const colors = {
      Work: "bg-yellow-100 text-yellow-800",
      Personal: "bg-green-100 text-green-800",
      Study: "bg-purple-100 text-purple-800",
      Ideas: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = sortedNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(sortedNotes.length / notesPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#A0522D] text-white pl-3 pr-2 py-8 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Note Easy 📖</h2>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("All")}
            className={`w-full text-left p-2 rounded-lg font-semibold transition text-sm flex items-center gap-2 ${
              activeTab === "All"
                ? "bg-white text-[#A0522D]"
                : "hover:bg-[#CA8A04] bg-transparent"
            }`}
          >
            <FaFolder /> All Notes
          </button>
          <div className="mt-2">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center justify-between w-full p-2 rounded-lg font-semibold text-sm hover:bg-[#CA8A04] transition"
            >
              <span>📂 Categories</span>{" "}
              <span>{showCategories ? "▲" : "▼"}</span>
            </button>
            {showCategories && (
              <div className="ml-4 mt-2 flex flex-col gap-1">
                {categories.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`block text-left p-2 rounded-lg text-sm transition ${
                      activeTab === tab
                        ? "bg-white text-[#A0522D]"
                        : "hover:bg-[#CA8A04] bg-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setActiveTab("Trash")}
            className={`w-full text-left mt-2 p-2 rounded-lg font-semibold transition text-sm flex items-center gap-2 ${
              activeTab === "Trash"
                ? "bg-white text-[#A0522D]"
                : "hover:bg-[#CA8A04] bg-transparent"
            }`}
          >
            <FaRegTrashAlt /> Trash
          </button>
          <button
            onClick={() => setActiveTab("History")}
            className={`w-full text-left p-2 rounded-lg font-semibold transition text-sm flex items-center gap-2 ${
              activeTab === "History"
                ? "bg-white text-[#A0522D]"
                : "hover:bg-[#CA8A04] bg-transparent"
            }`}
          >
            <FaHistory /> View Edit History
          </button>
          <div className="mt-auto border-t border-[#CA8A04] pt-4">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 w-full rounded-lg text-left font-semibold transition text-sm flex items-center gap-2 hover:bg-red-600 bg-transparent"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="🔍 Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-800/75 "
            />
            {suggestedTags.length > 0 && (
              <div className="absolute top-10 left-0 bg-white border shadow-lg w-full z-10 rounded-md p-2">
                {suggestedTags.map((tag) => (
                  <div
                    key={tag}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => setSearch("#" + tag)}
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Sort */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-5 py-2 pr-5 border rounded-full text-sm focus:ring-2 focus:ring-[#A0522D]"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="A-Z">A-Z (ก-ฮ)</option>
              <option value="Z-A">Z-A (ฮ-ก)</option>
            </select>
          </div>
        </div>

        {/* กล่องnoteใหม่ */}
        {showNewNoteBox && activeTab !== "History" && activeTab !== "Trash" && (
          <div className="mb-6 bg-white border border-gray-300 rounded-md mt-2 p-4">
            <div className="flex justify-between items-center gap-2 mb-2">
              <div className="flex gap-5 text-gray-500 pr-2 relative">
                <div className="relative">
                  <FaHashtag
                    className="cursor-pointer hover:text-gray-700"
                    title="Add Tag"
                    onClick={() => setShowTagInput((prev) => !prev)}
                  />
                  {/* โชว์ใส่taginput */}
                  {showTagInput && (
                    <div className="absolute top-6 left-0 bg-white border rounded p-2 shadow-md flex gap-2 z-10">
                      <input
                        type="text"
                        value={tagValue}
                        onChange={(e) => setTagValue(e.target.value)}
                        placeholder="Enter tag"
                        className="border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded p-1 text-sm"
                      />
                      <button
                        onClick={() => {
                          if (tagValue.trim()) {
                            setNewNote((prev) => ({
                              ...prev,
                              tags: [...prev.tags, tagValue.trim()],
                            }));
                            setTagValue("");
                            setShowTagInput(false);
                          }
                        }}
                        className="bg-[#A0522D] text-white px-4 rounded-full hover:bg-[#CA8A04]"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <FaLayerGroup
                    className="cursor-pointer hover:text-gray-700"
                    title="Add Category"
                    onClick={() => setShowCategoryInput((prev) => !prev)}
                  />
                  {/* โชว์ใส่มวดหมู่ */}
                  {showCategoryInput && (
                    <div className="absolute top-6 left-0 bg-white border rounded p-2 shadow-md flex gap-2 z-10">
                      <input
                        type="text"
                        value={categoryValue}
                        onChange={(e) => setCategoryValue(e.target.value)}
                        placeholder="Enter category"
                        className="border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded p-1 text-sm"
                      />
                      <button
                        onClick={() => {
                          if (categoryValue.trim()) {
                            setNewNote((prev) => ({
                              ...prev,
                              category: categoryValue.trim(),
                            }));
                            setCategoryValue("");
                            setShowCategoryInput(false);
                          }
                        }}
                        className="bg-[#A0522D] text-white px-4 rounded-full hover:bg-[#CA8A04]"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* กล่องใส่โน้ต */}
            <textarea
              placeholder="Add your note..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y min-h-[100px]"
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
            />
            {/* แสดงตอนเพิ่มtagกับหมวดมหมู่ */}
            <div className="mt-2 text-sm text-gray-700">
              {newNote.tags.length > 0 && (
                <p>
                  Tags added: {newNote.tags.map((tag) => `#${tag}`).join(", ")}
                </p>
              )}
              {newNote.category && <p>Category: {newNote.category}</p>}
            </div>

            <div className="flex justify-end mt-2 gap-2">
              <button
                onClick={handleAddNote}
                className="bg-yellow-800 text-white px-8 py-2 rounded-full hover:bg-yellow-600"
              >
                Post
              </button>
              <button
                onClick={() => setShowNewNoteBox(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-full hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "History" ? (
          <div>
            <h3 className="text-lg font-bold mb-4">Edit History</h3>
            {history.length === 0 ? (
              <p className="text-gray-500">No edit history yet</p>
            ) : (
              <ul className="space-y-2">
                {history.map((h, i) => (
                  <li key={i} className="border rounded p-3 bg-white shadow-sm">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Note #{h.id}</span>
                      <span>{new Date(h.editedAt).toLocaleString()}</span>
                    </div>
                    <p className="mb-1">
                      Edited by: <strong>{h.editedBy}</strong>
                    </p>
                    <p className="text-red-600 line-through mb-1">
                      Old: {h.oldContent}
                    </p>
                    <p className="text-green-600">New: {h.newContent}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : activeTab === "Trash" ? (
          <div>
            <h3 className="text-lg font-bold mb-4">Trash</h3>
            {trash.length === 0 ? (
              <p className="text-gray-500">No deleted notes</p>
            ) : (
              <ul className="space-y-2">
                {trash.map((t, i) => (
                  <li key={i} className="border rounded p-3 bg-white shadow-sm">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{t.author}</span>
                      <span>{new Date(t.deletedAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700">{t.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <>
            {/* ตอนที่ไม่มีnoteอะไรเลย */}
            {sortedNotes.length === 0 ? (
              <div className="text-center py-25">
                <img
                  src="https://illustrations.popsy.co/pink/presentation.svg"
                  alt="No notes"
                  className="mx-auto mb-4 w-64 h-64"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notes yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start creating your first note!
                </p>
                <button
                  onClick={() => setShowNewNoteBox(true)}
                  className="bg-[#A0522D] text-white px-6 py-2 rounded-full hover:bg-[#CA8A04]"
                >
                  Add Note
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="relative bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:shadow-pink-400/60 transition p-6"
                  >
                    {/* Note Header */}
                    <div className="flex justify-between mb-2 items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#A0522D] text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {note.author
                            ? note.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : ""}
                        </div>
                        <strong>{note.author}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {note.lastEditedAt
                            ? `Edited: ${new Date(
                                note.lastEditedAt
                              ).toLocaleString()}`
                            : new Date(note.createdAt).toLocaleString()}
                        </span>
                        {/* ปุ่ม ... เพิ่มแท็ก */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowAddTag((prev) =>
                                prev === note.id ? null : note.id
                              )
                            }
                            className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded-full"
                            title="Add Tag"
                          >
                            <FaEllipsisH />
                          </button>

                          {/* Input เพิ่มแท็ก */}
                          {showAddTag === note.id && (
                            <div className="absolute right-0 top-6 bg-white border rounded p-2 shadow-md flex gap-2 z-10">
                              <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Enter tag"
                                className="border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded p-1 text-sm"
                              />
                              <button
                                onClick={() => {
                                  if (newTag.trim()) {
                                    setNotes((prev) =>
                                      prev.map((n) =>
                                        n.id === note.id
                                          ? {
                                              ...n,
                                              tags: [...n.tags, newTag.trim()],
                                            }
                                          : n
                                      )
                                    );
                                    setNewTag("");
                                    setShowAddTag(null);
                                  }
                                }}
                                className="bg-[#A0522D] text-white px-4 rounded-full focus-ring-blue-500 hover:bg-[#CA8A04]"
                              >
                                Add
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {pinnedNotes.includes(note.id) && (
                      <div className="flex items-center gap-1 text-blue-500 text-sm">
                        <FaThumbtack /> Pinned
                      </div>
                    )}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                        note.category
                      )}`}
                    >
                      {note.category}
                    </span>

                    {editingNote && editingNote.id === note.id ? (
                      <>
                        <textarea
                          className="w-full border rounded-lg p-2 mt-2"
                          value={editingNote.content}
                          onChange={(e) =>
                            setEditingNote({
                              ...editingNote,
                              content: e.target.value,
                            })
                          }
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={handleSaveEdit}
                            className="bg-[#A0522D] text-white px-5 py-1 rounded-full hover:bg-[#CA8A04]"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-300 text-gray-800 px-4 py-1 rounded-full hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="mt-2">{note.content}</p>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="text-[#A0522D] hover:text-[#CA8A04]"
                      >
                        ✍🏻
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2">
            {/* ปุ่มย้อนกลับ */}
            <button
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              className={`px-6 py-1 rounded-full text-sm ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              Back
            </button>

            {/* หมายเลขหน้า */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-1 rounded-full text-sm ${
                  currentPage === index + 1
                    ? "bg-[#A0522D] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {/* ปุ่ม Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
              className={`px-6 py-1 rounded-full text-sm ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-bold mb-4">ออกจากระบบ</h3>
            <p className="mb-4">คุณแน่ใจว่าต้องการออกจากระบบหรือไม่?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-6 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  navigate("/");
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-800"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
