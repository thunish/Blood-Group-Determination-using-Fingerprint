import React, { useState } from 'react';
import { Upload, Fingerprint, Zap, AlertCircle, CheckCircle2, Code, FlaskConical } from 'lucide-react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setPrediction("");
    
    // Create preview URL
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await axios.post("https://blood-group-determination-using.onrender.com/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setPrediction(response.data.predicted_label);
    } catch (err) {
      console.error("Prediction failed:", err);
      setPrediction("Error occurred");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFile(null);
    setPrediction("");
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Development Status Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 rounded-full px-4 py-2 backdrop-blur-sm">
            <Code className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">🚧 Development Phase</span>
            <FlaskConical className="w-4 h-4 text-orange-400" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Fingerprint className="w-12 h-12 text-blue-400" />
            <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          
          {/* Blinking Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            FingerPrint AI
          </h1>
          
          <div className="animate-pulse">
            <p className="text-xl md:text-2xl text-blue-300 font-semibold mb-2">
              🩸 Blood Group Prediction System
            </p>
          </div>
          
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Revolutionary AI-powered fingerprint analysis to predict blood groups with advanced machine learning algorithms
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* File Upload Area */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-center text-blue-300 mb-6">
                  Upload Fingerprint Image
                </h3>
                
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-500/20 scale-105' 
                      : 'border-gray-400 hover:border-blue-400 hover:bg-blue-500/10'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                  />
                  
                  <div className="text-center">
                    <Upload className={`w-16 h-16 mx-auto mb-4 transition-all duration-300 ${
                      dragActive ? 'text-blue-400 scale-110' : 'text-gray-400'
                    }`} />
                    
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        {dragActive ? 'Drop your image here!' : 'Drag & drop your fingerprint image'}
                      </p>
                      <p className="text-gray-400">
                        or <span className="text-blue-400 underline cursor-pointer">browse files</span>
                      </p>
                      <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                {previewUrl && (
                  <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-blue-300">Preview</h4>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-xs max-h-48 rounded-lg shadow-lg border border-white/20"
                      />
                    </div>
                    <p className="text-sm text-gray-400 text-center mt-3">{file?.name}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={!file || loading}
                  className={`group relative px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                    !file || loading
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyzing Fingerprint...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 group-hover:animate-pulse" />
                      Predict Blood Group
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Results */}
            {prediction && (
              <div className="mt-8 animate-fadeIn">
                <div className={`rounded-2xl p-6 border ${
                  prediction === "Error occurred"
                    ? 'bg-red-500/20 border-red-400/30'
                    : 'bg-green-500/20 border-green-400/30'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {prediction === "Error occurred" ? (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    )}
                    <h3 className="text-xl font-semibold">
                      {prediction === "Error occurred" ? 'Prediction Failed' : 'Prediction Result'}
                    </h3>
                  </div>
                  
                  {prediction === "Error occurred" ? (
                    <p className="text-red-300">
                      Sorry, we couldn't analyze your fingerprint. Please try again with a clearer image.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg">
                        <span className="text-gray-300">Predicted Blood Group:</span>
                      </p>
                      <p className="text-3xl font-bold text-green-400 animate-pulse">
                        {prediction}
                      </p>
                      <p className="text-sm text-gray-400 mt-4">
                        * This is an experimental prediction. Please consult medical professionals for accurate blood typing.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex justify-center items-center gap-2 text-gray-400">
            <FlaskConical className="w-4 h-4" />
            <span className="text-sm">Powered by Advanced Machine Learning</span>
          </div>
          <p className="text-xs text-gray-500">
            This project is currently under development. Results may vary and should not be used for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;