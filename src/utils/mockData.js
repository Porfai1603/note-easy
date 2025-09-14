// Mock notes
export let mockNotes = [
  {
      id: 1,
      author: "Porfai",
      createdAt: "2024-01-15T10:30:00Z",
      category: "Work",
      content: "ประชุมทีมเรื่องโปรเจคใหม่ วันจันทร์ 9:00 น. ต้องเตรียมเอกสารและนำเสนอแผนงาน",
      tags: ["meeting", "project", "planning"]
    },
    {
      id: 2,
      author: "cheese",
      createdAt: "2024-01-14T14:20:00Z",
      category: "Personal",
      content: "รายการสิ่งที่ต้องซื้อ: ข้าว ",
      tags: []
    },
    {
      id: 3,
      author: "pun",
      createdAt: "2024-01-14T14:20:00Z",
      category: "",
      content: "รายการสิ่งที่ต้องซื้อ: น้ำมัน ",
      tags: []
    },
    {
      id: 4,
      author: "Bam",
      createdAt: "2024-01-14T14:20:00Z",
      category: "Personal",
      content: "รายการสิ่งที่ต้องซื้อ: ผัก ",
      tags: []
    },
    {
      id: 5,
      author: "toon",
      createdAt: "2024-01-14T14:20:00Z",
      category: "Personal",
      content: "รายการสิ่งที่ต้องซื้อ: ผลไม้ ",
      tags: []
    },
    {
      id: 6,
      author: "Leo",
      createdAt: "2024-01-14T14:20:00Z",
      category: "Personal",
      content: "รายการสิ่งที่ต้องซื้อ: อาหารแมว",
      tags: []
    },
    {
      id: 7,
      author: "ปอฝ้าย",
      createdAt: "2024-01-14T14:20:00Z",
      category: "Personal",
      content: "ข้าวผัด",
      tags: []
    },
    {
      id: 8,
      author: "ชีส",
      createdAt: "2024-01-14T14:20:00Z",
      category: "Personal",
      content: "อาหารนก",
      tags: []
    },

    {
      id: 9,
      author: "แบม",
      createdAt: "2024-01-14T14:20:00Z",
      category: "Personal",
      content: "สอบปจ",
      tags: []
    },
    {
      id: 10,
      author: "ตูน",
      createdAt: "2024-01-14T14:20:00Z",
      category: "Personal",
      content: "ดูF1",
      tags: []
    },
];

// Function to add a note
export function addNote(note) {
  const newId = mockNotes.length + 1;
  mockNotes.push({ ...note, id: newId, createdAt: new Date().toISOString(), updatedAt: [new Date().toISOString()] });
}

// Function to update a note
export function updateNote(id, updatedContent) {
  const note = mockNotes.find(n => n.id === id);
  if (note) {
    note.content = updatedContent;
    note.updatedAt.push(new Date().toISOString());
  }
}

// Function to get notes by user
export function getNotesByUser(email) {
  return mockNotes.filter(n => n.author === email);
}
