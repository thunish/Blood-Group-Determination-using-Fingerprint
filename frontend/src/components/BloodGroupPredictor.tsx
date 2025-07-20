// import React, { useState } from 'react';
// import axios from 'axios';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Upload, Activity, AlertCircle, CheckCircle2, FileImage, Loader2 } from 'lucide-react';
// import { useToast } from "@/hooks/use-toast";

// const BloodGroupPredictor = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [prediction, setPrediction] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [preview, setPreview] = useState<string | null>(null);
//   const { toast } = useToast();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setPrediction("");
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setPreview(e.target?.result as string);
//       };
//       reader.readAsDataURL(selectedFile);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     setLoading(true);

//     try {
//       const response = await axios.post("http://localhost:3000/predict", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
      
//       setPrediction(response.data.predicted_label);
//       toast({
//         title: "Prediction Complete!",
//         description: `Blood group predicted: ${response.data.predicted_label}`,
//       });
//     } catch (err) {
//       console.error("Prediction failed:", err);
//       setPrediction("Error occurred");
//       toast({
//         title: "Prediction Failed",
//         description: "Unable to process the image. Please try again.",
//         variant: "destructive",
//       });
//     }
//     setLoading(false);
//   };

//   const resetForm = () => {
//     setFile(null);
//     setPrediction("");
//     setPreview(null);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-medical flex flex-col items-center p-4">
//       {/* Header Section */}
//       <div className="w-full max-w-4xl text-center mb-8 animate-slide-up">
//         <div className="flex items-center justify-center gap-3 mb-4">
//           <Activity className="h-10 w-10 text-primary animate-pulse-glow" />
//           <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-blink">
//             BloodVision AI
//           </h1>
//           <Activity className="h-10 w-10 text-primary animate-pulse-glow" />
//         </div>
        
//         <p className="text-lg md:text-xl text-muted-foreground mb-4">
//           Advanced Fingerprint-Based Blood Group Prediction
//         </p>
        
//         <div className="flex justify-center items-center gap-2 mb-6">
//           <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
//             <AlertCircle className="h-3 w-3 mr-1" />
//             Development Phase
//           </Badge>
//           <Badge variant="outline" className="bg-medical-blue border-medical-blue/20">
//             <FileImage className="h-3 w-3 mr-1" />
//             ML Powered
//           </Badge>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="w-full max-w-2xl animate-scale-in">
//         <Card className="shadow-medical border-border/50 backdrop-blur-sm bg-card/95">
//           <CardHeader className="text-center">
//             <CardTitle className="text-2xl flex items-center justify-center gap-2">
//               <Upload className="h-6 w-6 text-primary" />
//               Upload Fingerprint Image
//             </CardTitle>
//           </CardHeader>
          
//           <CardContent className="space-y-6">
//             {/* File Upload Section */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="relative">
//                 <label
//                   htmlFor="file-upload"
//                   className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:border-primary/50"
//                 >
//                   {preview ? (
//                     <div className="relative w-full h-full p-4">
//                       <img
//                         src={preview}
//                         alt="Preview"
//                         className="w-full h-full object-contain rounded-lg"
//                       />
//                       <div className="absolute top-2 right-2">
//                         <Badge variant="secondary">
//                           {file?.name}
//                         </Badge>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                       <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
//                       <p className="mb-2 text-sm text-muted-foreground">
//                         <span className="font-semibold">Click to upload</span> or drag and drop
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         PNG, JPG or JPEG (MAX. 10MB)
//                       </p>
//                     </div>
//                   )}
//                 </label>
//                 <input
//                   id="file-upload"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-3">
//                 <Button
//                   type="submit"
//                   disabled={!file || loading}
//                   className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Analyzing...
//                     </>
//                   ) : (
//                     <>
//                       <Activity className="mr-2 h-4 w-4" />
//                       Predict Blood Group
//                     </>
//                   )}
//                 </Button>
                
//                 {(file || prediction) && (
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={resetForm}
//                     disabled={loading}
//                   >
//                     Reset
//                   </Button>
//                 )}
//               </div>
//             </form>

//             {/* Results Section */}
//             {prediction && (
//               <div className="animate-slide-up">
//                 <Card className={`border-2 ${
//                   prediction === "Error occurred" 
//                     ? "border-destructive/20 bg-destructive/5" 
//                     : "border-success/20 bg-success/5"
//                 }`}>
//                   <CardContent className="pt-6">
//                     <div className="flex items-center justify-center gap-3">
//                       {prediction === "Error occurred" ? (
//                         <AlertCircle className="h-6 w-6 text-destructive" />
//                       ) : (
//                         <CheckCircle2 className="h-6 w-6 text-success" />
//                       )}
//                       <div className="text-center">
//                         <p className="text-sm text-muted-foreground mb-1">
//                           Predicted Blood Group:
//                         </p>
//                         <p className={`text-2xl font-bold ${
//                           prediction === "Error occurred" 
//                             ? "text-destructive" 
//                             : "text-success"
//                         }`}>
//                           {prediction}
//                         </p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}

//             {/* Disclaimer */}
//             <div className="text-center text-xs text-muted-foreground border-t pt-4">
//               <p className="flex items-center justify-center gap-1">
//                 <AlertCircle className="h-3 w-3" />
//                 This is an experimental AI model. Results should not be used for medical diagnosis.
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Footer */}
//       <div className="mt-8 text-center text-sm text-muted-foreground">
//         <p>© 2024 BloodVision AI - Powered by Machine Learning</p>
//       </div>
//     </div>
//   );
// };

// export default BloodGroupPredictor;