"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2, ArrowLeft } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  yearPublished: number;
  imageUrl: string;
  description: string;
}

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams(); // expects /books/[id]/edit
  const bookId = params?.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [yearPublished, setYearPublished] = useState<number>(2025);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);

  // Fetch single book by id (you'll need a GET /api/books/{id} later if you want)
  const fetchBook = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/books`);
      if (!res.ok) throw new Error("Failed to load books");
      const data: Book[] = await res.json();
      const found = data.find((b) => String(b.id) === String(bookId));
      if (!found) throw new Error("Book not found");
      setBook(found);

      setTitle(found.title);
      setAuthor(found.author);
      setYearPublished(found.yearPublished);
      setDescription(found.description);
      setImageUrl(found.imageUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const updateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    const payload: Book = {
      id: book.id,
      title,
      author,
      yearPublished,
      description,
      imageUrl, // keep same image URL (no upload)
    };

    try {
      setSubmitting(true);
      const res = await fetch(`http://localhost:8080/api/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update book");

      // after update, go back to list (change route if diff)
      router.push("/books");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm shadow-lg shadow-black/40">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          Loading book details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-white/10 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-transparent">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8">
          <button
            onClick={() => router.back()}
            className="inline-flex w-fit items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </button>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Edit book
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/40">
                  <BookOpen className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    Update &quot;{book.title}&quot;
                  </h1>
                  <p className="mt-1 text-sm text-slate-300">
                    Change the details of this book. Cover image stays the same
                    unless you change it in the backend.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400">
              <p>Book ID: {book.id}</p>
              <p className="mt-0.5">Current year: {book.yearPublished}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 pb-14 pt-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          {/* Form card */}
          <Card className="border-slate-800 bg-slate-900/80 shadow-xl shadow-black/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-slate-50">
                Book details
              </CardTitle>
              <p className="mt-1 text-xs text-slate-400">
                Update the fields and save your changes.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateBook} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs text-slate-200">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Book title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="author" className="text-xs text-slate-200">
                    Author
                  </Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="yearPublished"
                    className="text-xs text-slate-200"
                  >
                    Year published
                  </Label>
                  <Input
                    id="yearPublished"
                    type="number"
                    placeholder="2025"
                    value={yearPublished}
                    onChange={(e) =>
                      setYearPublished(Number(e.target.value) || 0)
                    }
                    required
                    className="border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="description"
                    className="text-xs text-slate-200"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Book description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="min-h-[90px] border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  />
                </div>

                {/* Optional: imageUrl field if you wanna manually tweak path */}
                <div className="space-y-1.5">
                  <Label htmlFor="imageUrl" className="text-xs text-slate-200">
                    Image URL (optional)
                  </Label>
                  <Input
                    id="imageUrl"
                    placeholder="/uploads/cover.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="border-slate-700 bg-slate-900/70 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Normally this stays as is. It should match what your backend
                    saved when you uploaded the image.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-slate-700 bg-transparent text-xs text-slate-200 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="ml-auto bg-emerald-500 text-sm font-medium text-slate-950 hover:bg-emerald-400"
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving changes...
                      </span>
                    ) : (
                      "Update book"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Live preview card */}
          <Card className="border-slate-800 bg-slate-900/80 shadow-xl shadow-black/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm text-slate-100">
                Live preview
              </CardTitle>
              <p className="mt-1 text-xs text-slate-400">
                See how the updated book will look in your collection.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative h-52 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
                {imageUrl ? (
                  <>
                    <img
                      src={`http://localhost:8080${imageUrl}`}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
                    <BookOpen className="h-6 w-6" />
                    <p className="text-xs">Cover preview will appear here</p>
                  </div>
                )}
                <div className="absolute left-2 top-2">
                  <Badge className="bg-slate-950/80 text-[11px] font-normal text-slate-200 ring-1 ring-slate-700/80">
                    {yearPublished || "Year"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-50">
                  {title || "Book title"}
                </h3>
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-400/90">
                  {author || "Author name"}
                </p>
                <p className="mt-1 line-clamp-4 text-xs text-slate-300/90">
                  {description || "Book description will appear here as you edit."}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>Editing book #{book.id}</span>
                </span>
                <span className="rounded-full border border-slate-700/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                  Unsaved changes
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
