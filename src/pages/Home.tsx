import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Home = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save to session or state management if needed
    try {
      const response = await axios.post("https://2jlple5l42kiuf4fhoup77n4om0hqesm.lambda-url.ap-southeast-1.on.aws/", {
        name: name,
        mobile: mobile,
        action: "login"
      });
      const {statusCode} = response.data
      console.log("Response:", response);
      if (statusCode === 201) {
        const profile={
          name: name,
          mobile: mobile,
          quota: 5
        }
        localStorage.setItem("profile", JSON.stringify(profile));
        navigate("/landing");
      } else if (statusCode === 200) {
        const quota = response.data.user.quota;
        const profile={
          name: name,
          mobile: mobile,
          quota
        }
        localStorage.setItem("profile", JSON.stringify(profile));
        navigate("/landing");
      }
      console.log("Data submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
    navigate("/landing");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white m-4 p-8 rounded-2xl shadow-lg space-y-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center text-indigo-600">Welcome</h1>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Mobile Number</label>
          <input
            type="number"
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Home;
