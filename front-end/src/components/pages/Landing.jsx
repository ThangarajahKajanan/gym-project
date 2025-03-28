import React, { useEffect } from 'react';
import "../../CSS/homestyle.css"
import "../../CSS/animate.css"
import { Link } from 'react-router-dom';
import about1 from "../../images/about1.jpg"
import about2 from '../../images/about2.jpg'; 
import about3 from '../../images/about3.jpg'; 
import class2 from '../../images/class2.png'; 
import class1 from '../../images/class1.jpg'; 
import schedule1 from '../../images/schedule1.png'; 
import gallery1 from '../../images/gallery1.jpg'; 
import gallery2 from '../../images/gallery2.jpg'; 
import gallery3 from '../../images/gallery3.jpg'; 
import gallery4 from '../../images/gallery4.jpg'; 
import price1 from '../../images/price1.jpg'; 
import price2 from '../../images/price2.jpg'; 
import price3 from '../../images/price3.jpg'; 


const GymWebsite = () => {
  useEffect(() => {
    const handleNavToggle = () => {
      const nav = document.querySelector(".nav");
      const hamburger = document.querySelector(".ham-burger");
      if (nav && hamburger) {
        nav.classList.toggle("open");
        hamburger.classList.toggle("active");
      }
    };

    const handleAccordion = (e) => {
      if (e.target.closest(".accordian-container")) {
        const allContainers = document.querySelectorAll(".accordian-container");
        const clickedContainer = e.target.closest(".accordian-container");
        
        allContainers.forEach(container => {
          if (container !== clickedContainer) {
            container.querySelector(".body").style.display = "none";
            container.classList.remove("active");
            const span = container.querySelector(".head span");
            if (span) {
              span.classList.remove("fa-angle-down");
              span.classList.add("fa-angle-up");
            }
          }
        });

        const body = clickedContainer.querySelector(".body");
        if (body) {
          body.style.display = body.style.display === "block" ? "none" : "block";
          clickedContainer.classList.toggle("active");
          const span = clickedContainer.querySelector(".head span");
          if (span) {
            span.classList.toggle("fa-angle-down");
            span.classList.toggle("fa-angle-up");
          }
        }
      }
    };

    const handleSmoothScroll = (e) => {
      if (e.target.closest(".nav ul li a") || e.target.closest(".go-down")) {
        e.preventDefault();
        const target = e.target.closest("a");
        if (target && target.hash) {
          const hash = target.hash;
          const element = document.querySelector(hash);
          if (element) {
            window.scrollTo({
              top: element.offsetTop,
              behavior: 'smooth'
            });
            
            // Update URL
            window.history.pushState(null, null, hash);
            
            // Add active class to navigation
            document.querySelectorAll(".nav ul li a").forEach(link => {
              link.classList.remove("active");
            });
            target.classList.add("active");
          }
        }
      }
    };

    // Add event listeners
    document.querySelectorAll(".ham-burger, .nav ul li a").forEach(el => {
      el.addEventListener('click', handleNavToggle);
    });

    document.addEventListener('click', handleAccordion);
    document.addEventListener('click', handleSmoothScroll);

    // Initialize WOW.js
    if (typeof WOW !== 'undefined') {
      new WOW({
        animateClass: 'animated',
        offset: 0,
      }).init();
    }

    // Cleanup
    return () => {
      document.querySelectorAll(".ham-burger, .nav ul li a").forEach(el => {
        el.removeEventListener('click', handleNavToggle);
      });
      document.removeEventListener('click', handleAccordion);
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  return (
    <div>
      {/* Start Header */}
      <header>
        <div className="container">
          <div className="logo">
            <a href="">Power <span>Gym</span></a>
          </div>
          <a href="javascript:void(0)" className="ham-burger">
            <span></span>	
            <span></span>
          </a>
          <div className="nav">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#service">Services</a></li>
              <li><a href="#classes">Classes</a></li>
              <li><a href="#schedule">Schedule</a></li>
              <li><a href="#price">Price</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><Link to="/login">Log In</Link></li>
            </ul>
          </div>
        </div>
      </header>
      {/* End Header */}

      {/* Start Home */}
      <section className="home wow flash" id="home">
        <div className="container">
          <h1 className="wow slideInLeft" data-wow-delay="1s">It's <span>gym</span> time. Let's go</h1>
          <h1 className="wow slideInRight" data-wow-delay="1s">We are ready to <span>fit you</span></h1>
        </div>
        {/* go down */}
        <a href="#about" className="go-down">
          <i className="fa fa-angle-down" aria-hidden="true"></i>
        </a>
        {/* go down */}
      </section>
      {/* End Home */}

      {/* Start About */}
      <section className="about" id="about">
        <div className="container">
          <div className="content">
            <div className="box wow bounceInUp">
              <div className="inner">
                <div className="img">
                  <img src={about1} alt="about" />
                </div>
                <div className="text">
                  <h4>Free Consultation</h4>
                  <p>Start your fitness journey with a free consultation! Our expert trainers will assess your fitness level, discuss your goals, and provide a personalized workout plan. Get guidance on exercise, nutrition, and lifestyle changes to achieve the best results. No commitment—just expert advice, motivation, and support to help you get started!</p>
                </div>
              </div>
            </div>
            <div className="box wow bounceInUp" data-wow-delay="0.2s">
              <div className="inner">
                <div className="img">
                  <img src={about2} alt="about" />
                </div>
                <div className="text">
                  <h4>Best Training</h4>
                  <p>Experience the best training tailored to your needs! Our certified trainers use proven techniques to help you achieve your fitness goals efficiently and safely. Whether you're a beginner or advanced, we provide personalized workouts, expert guidance, and continuous support to ensure you get the most out of every session.</p>
                </div>
              </div>
            </div>
            <div className="box wow bounceInUp" data-wow-delay="0.4s">
              <div className="inner">
                <div className="img">
                  <img src={about3} alt="about" />
                </div>
                <div className="text">
                  <h4>Build Perfect Body</h4>
                  <p>Transform your body with our expert-led fitness programs designed to help you build strength, improve endurance, and sculpt the physique you've always wanted. Our customized workout plans and nutrition advice will guide you toward your fitness goals, ensuring you develop a balanced, strong, and healthy body.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End About */}

      {/* Start Service */}
      <section className="service" id="service">
        <div className="container">
          <div className="content">
            <div className="text box wow slideInLeft">
              <h2>Services</h2>
              <p>Our services are designed to help you achieve your fitness goals with expert guidance and personalized plans. Whether you're a beginner or an experienced athlete, we offer one-on-one training sessions, group workouts, and fitness assessments to ensure you stay on track. Our team provides tailored workouts to match your unique needs.</p>
              <p>In addition to physical training, we offer nutritional guidance, lifestyle coaching, and motivation to ensure your overall well-being. Whether you’re aiming to lose weight, build muscle, or improve endurance, our trainers provide the support you need. Start your transformation today with our professional services tailored just for you!</p>
              <a href="" className="btn">Start Now</a>
            </div>
            <div className="accordian box wow slideInRight">
              <div className="accordian-container active">
                <div className="head">
                  <h4>Cardiovascular Equipment</h4>
                  <span className="fa fa-angle-down"></span>
                </div>
                <div className="body">
                  <p>Our gym is equipped with top-tier strength training equipment to help you build muscle and increase strength. With a variety of free weights, machines, and resistance tools, you'll have everything you need to target different muscle groups and enhance your performance. Achieve your fitness goals with powerful workouts!</p>
                </div>
              </div>
              <div className="accordian-container">
                <div className="head">
                  <h4>Strength Training Equipment</h4>
                  <span className="fa fa-angle-up"></span>
                </div>
                <div className="body">
                  <p>Our gym is equipped with top-tier strength training equipment to help you build muscle and increase strength. With a variety of free weights, machines, and resistance tools, you'll have everything you need to target different muscle groups and enhance your performance. Achieve your fitness goals with powerful workouts!</p>
                </div>
              </div>
              <div className="accordian-container">
                <div className="head">
                  <h4>Group Fitness Class</h4>
                  <span className="fa fa-angle-up"></span>
                </div>
                <div className="body">
                  <p>Join our dynamic group fitness classes designed for all fitness levels! From yoga and pilates to high-intensity interval training, our expert instructors will guide you to achieve your fitness goals in a fun, motivating environment.</p>
                </div>
              </div>
              <div className="accordian-container">
                <div className="head">
                  <h4>Other Services</h4>
                  <span className="fa fa-angle-up"></span>
                </div>
                <div className="body">
                  <p>In addition to our core fitness offerings, we provide a range of other services including personalized coaching, injury rehabilitation, nutrition counseling, and wellness programs. Our experienced team is dedicated to helping you reach your full potential with tailored support that fits your unique needs, ensuring a holistic approach to your fitness and well-being journey.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Service */}

      {/* Start Classes */}
      <section className="classes" id="classes">
        <div className="container">
          <div className="content">
            <div className="box img wow slideInLeft">
              <img src={class2} alt="classes" />
            </div>
            <div className="box text wow slideInRight">
              <h2>Our Classes</h2>
              <p>Our classes are designed to cater to all fitness levels, from beginners to advanced athletes. We offer a variety of options including yoga, pilates, HIIT, spin, and strength training. Each class is led by experienced instructors who provide personalized guidance to ensure you achieve your fitness goals in a fun and supportive environment.</p>
              <div className="class-items">
                <div className="item wow bounceInUp">
                  <div className="item-img">
                    <img src={class1} alt="classes" />
                  </div>
                  <div className="item-text">
                    <h4>Stretching Training</h4>
                    <p>Stretching training helps improve flexibility, reduce muscle tension, and prevent injury. Our sessions focus on dynamic and static stretches to enhance mobility and promote overall body health.</p>
                    <a href="">Get Details</a>
                  </div>
                </div>
                <div className="item wow bounceInUp">
                  <div className="item-text">
                    <h4>Flexibility Workouts</h4>
                    <p>Flexibility workouts improve joint mobility and muscle flexibility, helping to enhance movement, prevent injuries, and increase overall body flexibility.</p>
                    <a href="">Get Details</a>
                  </div>
                  <div className="item-img">
                    <img src={class1} alt="classes" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Classes */}

      {/* Start Today */}
      <section className="start-today">
        <div className="container">
          <div className="content">
            <div className="box text wow slideInLeft">
              <h2>Start Your Training Today</h2>
              <p>Start your training today and transform your fitness journey! Our expert trainers will guide you through personalized workouts, helping you achieve your goals and build strength, endurance, and overall well-being.</p>
              <a href="" className="btn">Start Now</a>
            </div>
            <div className="box img wow slideInRight">
              <img src={gallery4} alt="start today" />
            </div>
          </div>
        </div>
      </section>
      {/* End Start Today */}

      {/* Start Schedule */}
      <section className="schedule" id="schedule">
        <div className="container">
          <div className="content">
            <div className="box text wow slideInLeft">
              <h2>Classes Schedule</h2>
              <p>
              Explore our Classes Schedule to find the perfect fit for your fitness goals. We offer a wide range of classes, including strength training, flexibility workouts, and cardiovascular sessions, all designed to enhance your fitness journey. Whether you're a beginner or advanced, our experienced trainers will guide you every step of the way. Start your fitness journey with us today!
              </p>
              <img src={schedule1} alt="schedule" />
            </div>
            <div className="box timing wow slideInRight">
              <table className="table">
                <tbody>
                  <tr>
                    <td className="day" style={{color: "black"}}>Monday</td>
                    <td><strong>9:00 AM</strong></td>
                    <td>Body Building <br/> 9:00 to 10:00 AM</td>
                    <td>Room No:210</td>
                  </tr>
                  <tr>
                    <td className="day" style={{color: "black"}}>Tuesday</td>
                    <td><strong>9:00 AM</strong></td>
                    <td>Body Building <br/> 9:00 to 10:00 AM</td>
                    <td>Room No:211</td>
                  </tr>
                  <tr>
                    <td className="day" style={{color: "black"}}>Wednesday</td>
                    <td><strong>9:00 AM</strong></td>
                    <td>Body Building <br/> 9:00 to 10:00 AM</td>
                    <td>Room No:212</td>
                  </tr>
                  <tr>
                    <td className="day" style={{color: "black"}}>Thursday</td>
                    <td><strong>9:00 AM</strong></td>
                    <td>Body Building <br/> 9:00 to 10:00 AM</td>
                    <td>Room No:215</td>
                  </tr>
                  <tr>
                    <td className="day" style={{color: "black"}}>Friday</td>
                    <td><strong>9:00 AM</strong></td>
                    <td>Body Building <br/> 9:00 to 10:00 AM</td>
                    <td>Room No:220</td>
                  </tr>
                  <tr>
                    <td className="day" style={{color: "black"}}>Saturday</td>
                    <td><strong>9:00 AM</strong></td>
                    <td>Body Building <br/> 9:00 to 10:00 AM</td>
                    <td>Room No:212</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      {/* End Schedule */}

      {/* Start Gallery */}
      <section className="gallery" id="gallery">
        <h2>Workout Gallery</h2>
        <div className="content">
          <div className="box wow slideInLeft">
            <img src={gallery1} alt="gallery" />
          </div>
          <div className="box wow slideInRight">
            <img src={gallery2} alt="galleryfkgbnrkgnkrngkrngkrngkergergergeg" />
          </div>
          <div className="box wow slideInLeft">
            <img src={gallery3} alt="gallery" />
          </div>
          <div className="box wow slideInRight">
            <img src={gallery4}  alt="gallery" />
          </div>
        </div>
      </section>
      {/* End Gallery */}

      {/* Start Price */}
      <section className="price-package" id="price">
        <div className="container">
          <h2>Choose Your Package</h2>
          <p className="title-p">Select the ideal fitness package that suits your goals today!</p>
          <div className="content">
            <div className="box wow bounceInUp">
              <div className="inner">
                <div className="price-tag">
                  25000/Month
                </div>
                <div className="img">
                  <img src={price1} alt="price" />
                </div>
                <div className="text">
                  <h3>Body Building Training</h3>
                  <p>Get Free WiFi</p>
                  <p>Month to Month</p>
                  <p>No Time Restrictions</p>
                  <p>Gym and Cardio</p>
                  <p>Service Locker Rooms</p>
                  <a href="" className="btn">Join Now</a>
                </div>
              </div>
            </div>
            <div className="box wow bounceInUp" data-wow-delay="0.2s">
              <div className="inner">
                <div className="price-tag">
                  2000/Month
                </div>
                <div className="img">
                  <img src={price2} alt="price" />
                </div>
                <div className="text">
                  <h3>Cardio Training </h3>
                  <p>Get Free WiFi</p>
                  <p>Month to Month</p>
                  <p>No Time Restrictions</p>
                  <p>Gym and Cardio</p>
                  <p>Service Locker Rooms</p>
                  <a href="" className="btn">Join Now</a>
                </div>
              </div>
            </div>
            <div className="box wow bounceInUp" data-wow-delay="0.4s">
              <div className="inner">
                <div className="price-tag">
                  2000/Month
                </div>
                <div className="img">
                  <img src={price3} alt="price" />
                </div>
                <div className="text">
                  <h3>Group Fitness Classes</h3>
                  <p>Get Free WiFi</p>
                  <p>Month to Month</p>
                  <p>No Time Restrictions</p>
                  <p>Gym and Cardio</p>
                  <p>Service Locker Rooms</p>
                  <a href="" className="btn">Join Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Price */}

      {/* Start Contact */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="content">
            <div className="box form wow slideInLeft">
              <form>
                <input type="text" placeholder="Enter Name" />
                <input type="text" placeholder="Enter Email" />
                <input type="text" placeholder="Enter Mobile" />
                <textarea placeholder="Enter Message"></textarea>
                <button type="submit">Send Message</button>
              </form>
            </div>
            <div className="box text wow slideInRight">
              <h2>Get Connected with Gym</h2>
              <p className="title-p">Contact us today to learn more about our services and begin your fitness journey with expert guidance and support!</p>
              <div className="info">
                <ul>
                  <li><span className="fa fa-map-marker"></span> No 224, Galle Road, Wellawatte, Colombo 06</li>
                  <li><span className="fa fa-phone"></span> +94 76 878 89 54</li>
                  <li><span className="fa fa-envelope"></span> info@powergym.com</li>
                </ul>
              </div>
              <div className="social">
                <a href=""><span className="fa fa-facebook"></span></a>
                <a href=""><span className="fa fa-youtube-play"></span></a>
              </div>
              <div className="copy">
                PowerBy &copy; ABZ creative
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Contact */}
    </div>
  );
};

export default GymWebsite;