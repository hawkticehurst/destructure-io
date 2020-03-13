import React, { useState } from 'react';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import PrivacySection from './PrivacySection';
import { getApproveCookie } from '../../hooks/useModuleCompletionState';

function PrivacyPolicy() {
  const [hasApprovedCookies, setHasApprovedCookies] = useState(getApproveCookie() === 'true'); // this can return a string, so explicit check false

  const setApproveCookie = (value) => {
    const date = new Date();
    date.setTime(date.getTime() + (6*30*24*60*60*1000)); // Expires in 6 months
    document.cookie = "destructure-cookie-approve=" + value + ";expires=" + date.toUTCString() + ";path=/";
    setHasApprovedCookies(value === 'true');
    window.location.reload();
  };

  return (
    <div>
      <NavBar navBarType="homepage" />
      <div className="privacy-policy">
        <header>
          <h1>Privacy Policy</h1>
          <p><span className="bold">TL;DR:</span> We won't buy or sell data, ever.</p>
        </header>

        {
          !hasApprovedCookies ? (
            <div className="privacy-policy-allow-cookies">
              <p>
                You have not chosen to opt-in to cookies and local storage. This will
                prevent the site from saving your state when you change pages. Would you like to
                instead opt-in to cookies and local storage?
              </p>
              <button className="hero-btn" onClick={() => setApproveCookie("true")}>
                <span className="bold">Yes</span> - Opt in to Cookies and local web storage
              </button>
            </div>
          ) : null
        }

        <PrivacySection
          title="Introduction"
          text={
          `
          We take your privacy very seriously. We only collect information necessary for the proper functioning of
          the site and nothing else. This page outlines exactly what data we collect and why we collect it, but if you
          ever have any questions or concerns, we encourage you to contact us.
          `
          } />

        <PrivacySection
          title="Personally Identifiable Information"
          text={
          `
          The only piece of personally identifiable information we collect is your email address
          when you sign up for the site. We use this information to store your progress through our
          learning modules, but you can completely opt-out by not signing up for an account.
          The site will function perfectly as a "guest" without restrictions, and in that case we
          will not collect any information about you.
          `
          } />

        <PrivacySection
          title="How We Use And Store Your Information"
          text={
          [
            <span>
              All of our authentication and database services are run using{' '}
              <a target="__blank" rel="noopener noreferrer" href="https://policies.google.com/technologies/partner-sites">Google Firebase</a>,
              a highly trusted third party platform. When you sign up for an account, we store your email
              and an encrypted password on Firebase. Additionally, we store your current completion
              state of every module on the site. This allows us to retain this information when you
              leave the website.
            </span>,
          `
          We will never sell this information or any other information to any third parties.
          `
          ]
          } />

        <PrivacySection
          title="What Are Cookies?"
          text={[
            `
            A cookie is a small text file that a website stores in your browser (such as Chrome).
            Cookies cannot be used to run any programs on your computer or install any viruses.
            Most websites, such as destructure.io, use cookies to store information such as the current
            user, so you stay signed in after refreshing the page.
            `,
            `
            In addition to cookies, we also use local web storage to store more complex data.
            Web storage works in a very similar way to cookies, with the major difference being that they
            can store larger amounts of data.
            `
          ]
          } />

        <PrivacySection
          title="How We Use Cookies"
          text={[
            `
            All of the cookies we use are classified as "essential cookies". These are used to keep a
            user signed in even after the page reloads. Since our authentication is handled by Google Firebase,
            all of our authentication related cookies are third party cookies required for their platform to function.
            We also use a single cookie to check if the user has opted out of non-essential storage. If you opt-out,
            we will not share any information with Firebase and will not use local storage.
            `,
            `
            In addition to cookies, we use local web storage to keep track of your progress through the modules
            if you are not signed in. This allows for our "continue as guest" functionality to work properly. If you
            choose to completely opt-out of local storage, we will not store this information anywhere and thus it will
            not persist when the page is reloaded.
            `
          ]
          } />

        <PrivacySection
          title="Removal of Data"
          text={
            `
            If you wish to have any of your information removed from our servers, please
            contact us and we will complete your request as quickly as possible. Additionally,
            if you choose to delete your account, all of its information will be removed from
            our services.
            `
          } />

        <PrivacySection
          title="Changes To This Policy"
          text={
          [`
          We will occasionally update this policy statement to include information about new features
          of the site or to further clarify how we handle data privacy. We encourage you to periodically
          review this page for our latest policies.
          `,
          `
          Regardless of these changes, our philosophy on privacy will never change, and we will never
          sell any of your data.
          `
          ]
          } />
      </div>
      <hr />
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
