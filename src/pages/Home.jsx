import React from 'react';
import { Button, Card } from 'flowbite-react';
import { HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineClock } from 'react-icons/hi';
import { HiOutlineArchiveBox } from 'react-icons/hi2';
import { Header } from 'shared/ui';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="pt-20 pb-16 w-full bg-gray-50 dark:bg-gray-900">
          <div className="px-4 mx-auto max-w-screen-xl w-full">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <HiOutlineArchiveBox className="h-20 w-20 text-blue-600" />
              </div>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                Freezer Manager
              </h1>
              <p className="mb-10 text-lg font-medium text-gray-700 dark:text-gray-300 lg:text-xl max-w-3xl mx-auto leading-relaxed">
                Keep track of your frozen inventory with ease. Manage stock, and never lose track of your frozen goods again.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <Link to="/signup">
                  <Button size="xl" className="px-8 py-3 justify-self-center text-white bg-blue-600 hover:bg-blue-700 transition">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 w-full bg-gray-50 dark:bg-gray-900">
          <div className="px-4 mx-auto max-w-screen-xl w-full">
            <div className="text-center mb-16">
              <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white lg:text-4xl">
                Why Choose Freezer Manager?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-xl max-w-2xl mx-auto">
                Everything you need to manage your freezer inventory efficiently
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="text-center p-8 border-0 shadow-xl bg-white dark:bg-gray-800 transition-colors duration-300">
                <div className="flex justify-center mb-6">
                  <HiOutlineChartBar className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                  Real-time Monitoring
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Monitor expiration dates of all your products in real-time with alerts.
                </p>
              </Card>

              <Card className="text-center p-8 border-0 shadow-xl bg-white dark:bg-gray-800 transition-colors duration-300">
                <div className="flex justify-center mb-6">
                  <HiOutlineShieldCheck className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                  Smart Alerts
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Use QR-Codes for easy and efficient product management.
                </p>
              </Card>

              <Card className="text-center p-8 border-0 shadow-xl bg-white dark:bg-gray-800 transition-colors duration-300">
                <div className="flex justify-center mb-6">
                  <HiOutlineClock className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                  Inventory Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Keep detailed records of what's in each freezer with expiration dates and stock levels.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 w-full bg-gray-50 dark:bg-gray-900">
          <div className="px-4 mx-auto max-w-screen-xl w-full">
            <div className="mx-auto max-w-screen-sm text-center">
              <h2 className="mb-6 text-3xl font-extrabold leading-tight text-gray-900 dark:text-white lg:text-4xl">
                Start managing your freezers today
              </h2>
              <p className="mb-8 font-light text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                Join thousands of users who trust Freezer Manager to keep their inventory organized and safe.
              </p>
              <Link to="/signup">
                <Button size="xl" className="px-10 py-3 justify-self-center text-white bg-blue-600 hover:bg-blue-700 transition">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
