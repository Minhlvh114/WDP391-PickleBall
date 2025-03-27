import React, { use } from "react";
// import "tachyons";
import { Heading, Text } from "rebass"; // Chỉ import Heading và Text từ rebass
import {
  Hero,
  Flex,
  CallToAction,
  ScrollDownIndicator
} from "react-landing-page";
import { Link } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";


const LandingPage = () => {
  
  const { user } = useAuthStore()
  

  return (
    <Hero
      color="white"
      // backgroundImage="https://media.istockphoto.com/id/1402794680/vi/anh/c%E1%BA%ADu-b%C3%A9-ch%C6%A1i-b%C3%B3ng-d%C6%B0a-chua.jpg?s=612x612&w=0&k=20&c=t6JGhQwqF2Z4SByglNk1RwpfZxAjJQFNFULU_Dsb_VY="
      // backgroundImage="https://image.freepik.com/free-vector/colorful-memphis-design-background-vector_53876-81744.jpg"
      backgroundImage="https://media.istockphoto.com/id/2163941884/vi/anh/couple-playing-pickleball-celebrate-point.jpg?s=612x612&w=0&k=20&c=Kn5I7CVY4xN5MyWJ8cp3CJK_hCNeBJua8izKujXRZpI="
      bg="black"
      bgOpacity={0.1}
    >
      <Heading fontSize={150}>Pickleball</Heading>
      <Text fontSize={[2, 3]}>Powerful Serves, Swift Returns </Text> {/* Dùng Text thay Subhead */}
      <Flex mt={3}>
        <CallToAction bg="grey" mr={3}>
          <Link to={`/courts`} style={{ textDecoration: 'none', color: 'inherit' }}>  View More </Link>
        </CallToAction>
        <CallToAction>
          {user == null ? 
            <Link to={`/login`} style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link> :
            <Link to={`/courts`} style={{ textDecoration: 'none', color: 'inherit' }}>Back</Link>
          }
            
        </CallToAction>
      </Flex>
      <ScrollDownIndicator />
    </Hero>
    );
  };

  export default LandingPage;

