import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();

  const validateInputs = () => {
    if (!name || !email || !message) {
      setError("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;
      setSuccess("Your message has been sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* ✅ Success Toast */}
      {success && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md z-50 transition duration-300">
          {success}
        </div>
      )}

      <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          Contact Support
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center p-2 bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
            >
              Send to Backend
            </button>

            <a
              href={`mailto:ihaque3040@gmail.com?subject=Support Request from ${name}&body=${encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
              )}`}
              className="w-full text-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200"
            >
              Send via Email App
            </a>
          </div>
        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Our AI support team will get back to you within 24 hours.
        </p>
      </div>
    </div>
  );
};

export default Contact;
