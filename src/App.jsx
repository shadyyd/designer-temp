import Designer from "./components/Designer";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">T-Shirt Designer</h1>
        <Designer />
      </div>
    </div>
  );
};

export default App;
