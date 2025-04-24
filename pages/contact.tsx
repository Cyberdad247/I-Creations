import React from 'react';
import Layout from '../Layout';

const ContactPage: React.FC = () => {
  // Example gaming-style UI: animated form and support badge
  return (
    <Layout>
      <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Contact</h1>
      <div className="flex flex-col items-center mb-8">
        <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow animate-bounce mb-4">
          Support Squad
        </span>
        <form className="bg-white rounded-lg shadow p-8 w-full max-w-md flex flex-col gap-4 animate-fadeIn">
          <input
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Your Name"
            required
          />
          <input
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="Your Email"
            required
          />
          <textarea
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Your Message"
            rows={4}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send Message
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ContactPage;
