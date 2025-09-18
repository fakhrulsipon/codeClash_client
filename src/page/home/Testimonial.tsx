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
    rating: 4,
  },
];

const Testimonial = () => {
  return (
    <section className="px-4 py-16 mx-auto max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-10 mx-auto text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          What People Say About{" "}
          <span className="text-blue-400">codeClash</span>
        </h2>
        <p className="mt-4 text-base md:text-lg">
          Trusted by students, recruiters, and educators worldwide.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center gap-4">
              <img
                src={t.image}
                alt={t.name}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {t.name}
                </h3>
                <p className="text-sm">{t.role}</p>
              </div>
            </div>

            <p className="mt-4">{t.feedback}</p>

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
