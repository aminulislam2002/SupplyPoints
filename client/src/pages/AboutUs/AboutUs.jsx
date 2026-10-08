import { Link } from "react-router";
import {
  FaRocket,
  FaEye,
  FaHeart,
  FaUsers,
  FaShippingFast,
  FaShieldAlt,
  FaAward,
  FaGlobeAsia,
  FaHandshake,
  FaLeaf,
  FaStar,
} from "react-icons/fa";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic/useAxiosPublic";
import Loader from "../../components/Loader/Loader";
import usePlatform from "../../hooks/usePlatform/usePlatform";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const AboutUs = () => {
  const axiosPublic = useAxiosPublic();
  const { platform, isPlatformPending } = usePlatform();

  const stats = [
    {
      icon: <FaUsers className="text-3xl" />,
      value: "500K+",
      label: "Happy Customers",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: <FaShippingFast className="text-3xl" />,
      value: "1M+",
      label: "Orders Delivered",
      color: "from-green-400 to-green-600",
    },
    {
      icon: <FaAward className="text-3xl" />,
      value: "10K+",
      label: "Products Available",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: <FaStar className="text-3xl" />,
      value: "4.8/5",
      label: "Customer Rating",
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  const values = [
    {
      icon: <FaHeart className="text-3xl" />,
      title: "Customer First",
      description:
        "Your satisfaction is our top priority. We go above and beyond to ensure you have the best shopping experience.",
      color: "from-red-50 to-red-100  ",
      iconColor: "text-red-500",
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Quality Assured",
      description:
        "We partner with trusted brands and verify every product to ensure you receive only authentic, high-quality items.",
      color: "from-blue-50 to-blue-100  ",
      iconColor: "text-blue-500",
    },
    {
      icon: <FaShippingFast className="text-3xl" />,
      title: "Fast Delivery",
      description:
        "Experience swift and reliable delivery across Bangladesh. We ensure your orders reach you on time, every time.",
      color: "from-green-50 to-green-100  ",
      iconColor: "text-green-500",
    },
    {
      icon: <FaHandshake className="text-3xl" />,
      title: "Trust & Transparency",
      description:
        "We believe in honest business practices. Clear pricing, genuine reviews, and transparent policies are our foundation.",
      color: "from-purple-50 to-purple-100  ",
      iconColor: "text-purple-500",
    },
    {
      icon: <FaGlobeAsia className="text-3xl" />,
      title: "Wide Selection",
      description:
        "From electronics to fashion, home goods to beauty products - find everything you need in one convenient place.",
      color: "from-indigo-50 to-indigo-100  ",
      iconColor: "text-indigo-500",
    },
    {
      icon: <FaLeaf className="text-3xl" />,
      title: "Sustainability",
      description:
        "We're committed to eco-friendly practices, from packaging to partnerships, working towards a greener future.",
      color: "from-emerald-50 to-emerald-100  ",
      iconColor: "text-emerald-500",
    },
  ];

  // Fetch all journeys
  const { isPending, data: milestones = [] } = useQuery({
    queryKey: ["allMilestones"],
    queryFn: async () => {
      const res = await axiosPublic.get("/milestones");
      return res?.data && res?.data?.data;
    },
    placeholderData: keepPreviousData,
  });

  if (isPending || isPlatformPending) {
    return <Loader />;
  }

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "About Us", active: true },
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-700 text-primary-50 mb-6">
            <FaRocket size={40} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            About Supply Points
          </h1>
          <p className="max-w-2xl mx-auto text-base">
            Your trusted online shopping destination, delivering quality
            products and exceptional service across Bangladesh.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card p-5 text-center transition-shadow duration-300 hover:shadow-md"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <p className="text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="mb-10">
          <div className="card overflow-hidden">
            <div className="surface-muted border-b border-border-color p-5">
              <div className="flex items-center gap-4">
                <div className="surface flex h-12 w-12 items-center justify-center rounded-md text-primary-600">
                  <FaRocket className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold">Our Story</h2>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <p className="leading-relaxed">{platform?.ourStory}</p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
          <div className="card overflow-hidden">
            <div className="surface-muted border-b border-border-color p-5">
              <div className="flex items-center gap-4">
                <div className="surface flex h-12 w-12 items-center justify-center rounded-md text-primary-600">
                  <FaRocket className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold">Our Mission</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="leading-relaxed">{platform?.ourMission}</p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="surface-muted border-b border-border-color p-5">
              <div className="flex items-center gap-4">
                <div className="surface flex h-12 w-12 items-center justify-center rounded-md text-primary-600">
                  <FaEye className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold">Our Vision</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="leading-relaxed">{platform?.ourVision}</p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((value, index) => (
              <div
                key={index}
                className="card p-5 transition-shadow duration-300 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{value.title}</h3>
                <p className="text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Journey */}
        <div className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">
            Our Journey
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute bottom-0 left-8 top-0 hidden w-1 bg-primary-200 lg:block"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="card relative p-6 transition-shadow duration-300 hover:shadow-md lg:ml-20"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-12 top-8 hidden h-8 w-8 items-center justify-center rounded-full border-4 border-page-bg bg-primary-700 lg:flex">
                    <div className="w-3 h-3 rounded-full bg-primary-50"></div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="text-2xl font-bold text-primary-500">
                        {milestone.year}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        {milestone.title}
                      </h3>
                      <p className="leading-relaxed">
                        {milestone.descriptions}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="surface-muted rounded-lg border border-border-color p-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Join Our Journey
          </h2>
          <p className="max-w-2xl mx-auto mb-6">
            Be part of Bangladesh's fastest-growing e-commerce community.
            Experience the future of online shopping with Supply Points today!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn primary-btn px-8 py-3">
              Start Shopping
            </Link>
            <Link to="/contact" className="btn outline-btn px-8 py-3">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
