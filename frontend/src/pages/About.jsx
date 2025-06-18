import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-400 mb-4">About ChatAI</h1>
          <p className="text-xl text-gray-300">
            Your intelligent conversational partner powered by cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Our Mission</h2>
            <p className="text-gray-300">
              To revolutionize human-computer interaction by providing an AI chatbot that understands
              and responds with human-like intelligence, making technology more accessible and intuitive
              for everyone.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Our Vision</h2>
            <p className="text-gray-300">
              We envision a future where AI assistants seamlessly integrate into daily life, providing
              instant knowledge, personalized assistance, and meaningful conversations through advanced
              natural language processing.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl mb-12">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Our Technology</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-200">Groq API Integration</h3>
              <p className="text-gray-400">
                Powered by Groq's lightning-fast inference engine, delivering responses at unprecedented speed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-200">JWT Authentication</h3>
              <p className="text-gray-400">
                Secure user authentication with JSON Web Tokens for protected conversations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-200">Conversation Memory</h3>
              <p className="text-gray-400">
                Context-aware responses that remember your conversation history.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">Development Team</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center max-w-xs">
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-700 mb-4 overflow-hidden">
                <img 
                  src="https://static.vecteezy.com/system/resources/thumbnails/002/206/015/small/developer-working-icon-free-vector.jpg" 
                  alt="Developer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-200">Inzamamul Haque</h3>
              <p className="text-indigo-400">Full Stack Developer</p>
              <a href='https://inzu-11.framer.website/'>Portfolio</a>
              <p className="text-gray-400 mt-2 text-sm">
                Designed and implemented the AI chatbot system with Groq integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;