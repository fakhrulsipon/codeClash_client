import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Computer Science Student",
    feedback:
      "codeClash has completely changed how I practice coding! Competing with friends in real-time makes learning so much fun.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    name: "Michael Lee",
    role: "Software Engineer",
    feedback:
      "As a recruiter, I found the team challenge mode very useful for assessing candidates’ collaboration and problem-solving skills.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
  },
  {
    name: "Aisha Khan",
    role: "Hackathon Organizer",
    feedback:
      "Hosting online contests was super easy with codeClash. The real-time leaderboard kept participants engaged throughout!",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
  {
    name: "Daniel Green",
    role: "Coding Mentor",
    feedback:
      "The mentorship features helped me guide juniors effectively. The platform is super intuitive!",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    rating: 5,
  },
  {
    name: "Emily Carter",
    role: "University Lecturer",
    feedback:
      "I integrated codeClash into my classes, and students loved the competitive learning environment.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 4,
  },
  {
    name: "James Brown",
    role: "Full-Stack Developer",
    feedback:
      "The challenges sharpened my problem-solving skills. Highly recommend it to all developers!",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
  },
];

const Testimonial = () => {
  return (
    <section className="px-4 py-16 mx-auto max-w-screen-xl md:px-8 lg:py-20">
      {/* Section Heading */}
      <div className="max-w-2xl mb-12 mx-auto text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl text-gray-800">
          What People Say About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
            codeClash
          </span>
        </h2>
        <p className="mt-4 text-base md:text-lg text-gray-600">
          Trusted by students, recruiters, mentors, and educators worldwide.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-800">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>

            <p className="mt-4 text-gray-700 leading-relaxed">{t.feedback}</p>

            <div className="flex mt-4 text-yellow-400">
              {Array.from({ length: t.rating }).map((_, i) => (
                <FaStar key={i} size={18} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
