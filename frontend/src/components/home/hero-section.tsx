"use client"
import useUserStore from '../../store/user';
import CorporateHero from './corporate-hero';
import RegularHero from './regular-hero';

export default function HeroSection() {
  const { user } = useUserStore();
  
  // Check if user is corporate (has profilePhoto, name, and email)
  const isCorporateUser = user && user.profilePhoto && user.name && user.email;

  // Render appropriate hero section
  if (isCorporateUser) {
    return <CorporateHero user={user} />;
  }

  return <RegularHero />;
}