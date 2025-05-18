import React from "react";

const AboutUs = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center text-white flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url('https://t3.ftcdn.net/jpg/02/98/77/98/360_F_298779829_ibEOUDbVsakvtZVH1vG0Mk0bt1FAoCNM.jpg')`,
      }}
    >
      <div className="bg-black bg-opacity-50 p-10 rounded-xl max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to SkillCraft</h1>
        <p className="text-lg">
         At SkillCraft, we believe that learning new skills brings people together and opens doors to endless possibilities. We're passionate about empowering creators, innovators, and learners to unleash their full potential through engaging, hands-on courses taught by industry experts. Whether you're looking to boost your career, explore creative passions, or master new tools, SkillCraft is your go-to destination for skills made accessible. Our mission is simple: to make learning inspiring, practical, and transformative.
        </p>

      </div>
    </div>
  );
};

export default AboutUs;
