
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, MessageCircle, Mic } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-blue-900 dark:text-blue-100 mb-6">
            AI Agent Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Kelola layanan AI Agent Anda dengan mudah. Voice Agent dan Chat Agent dalam satu platform terpadu.
          </p>
          
          <Link to="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Masuk ke Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                <Mic className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Voice Agent</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              AI Assistant dengan kemampuan percakapan suara dan pemrosesan audio real-time
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Text-to-Speech berkualitas tinggi</li>
              <li>• Speech Recognition akurat</li>
              <li>• Real-time Processing</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Agent</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              AI Assistant untuk percakapan teks dengan pemahaman konteks yang mendalam
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Natural Language Processing</li>
              <li>• Context Awareness</li>
              <li>• Multi-language Support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
