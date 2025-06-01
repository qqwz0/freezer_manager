import React from 'react';
import { Button, Card } from 'flowbite-react';
import { HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineClock } from 'react-icons/hi';
import { HiOutlineArchiveBox } from 'react-icons/hi2';
import { Header } from 'shared/ui';

function Home() {
  return (
    <>
      <Header />
      {/* Removed overflow-x-hidden and fixed layout issues */}
      <div className="min-h-screen bg-gray-900">
        {/* Hero Section - Fixed width handling */}
        <section className="bg-gray-900 pt-20 pb-16 w-full">
          <div className="px-4 mx-auto max-w-screen-xl w-full">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <HiOutlineArchiveBox className="h-20 w-20 text-blue-600" />
              </div>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
                Freezer Manager
              </h1>
              <p className="mb-10 text-lg font-normal text-gray-300 lg:text-xl max-w-3xl mx-auto leading-relaxed">
                Keep track of your frozen inventory with ease. Manage stock, and never lose track of your frozen goods again.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <Button size="xl" href="/signup" className="px-8 py-3">
                  Get Started
                </Button>
                <Button color="light" size="xl" href="/dashboard" className="px-8 py-3">
                  View Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Fixed container overflow */}
        <section className="py-16 w-full">
          <div className="px-4 mx-auto max-w-screen-xl w-full">
            <div className="text-center mb-16">
              <h2 className="mb-4 text-3xl font-extrabold text-white lg:text-4xl">
                Why Choose Freezer Manager?
              </h2>
              <p className="text-gray-300 text-xl max-w-2xl mx-auto">
                Everything you need to manage your freezer inventory efficiently
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="text-center p-8 border-0 shadow-lg bg-white">
                <div className="flex justify-center mb-6">
                  <HiOutlineChartBar className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  Real-time Monitoring
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Monitor expiration dates of all your products in real-time with alerts.
                </p>
              </Card>

              <Card className="text-center p-8 border-0 shadow-lg bg-white">
                <div className="flex justify-center mb-6">
                  <HiOutlineShieldCheck className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  Smart Alerts
                </h3>
                <p className="text-gray-500 leading-relaxed">
                   Use QR-Codes for products easy and efficient product management.
                </p>
              </Card>

              <Card className="text-center p-8 border-0 shadow-lg bg-white">
                <div className="flex justify-center mb-6">
                  <HiOutlineClock className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  Inventory Tracking
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Keep detailed records of what's in each freezer with expiration dates and stock levels.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section - Fixed width constraints */}
        <section className="bg-gray-900 py-16 w-full">
          <div className="px-4 mx-auto max-w-screen-xl w-full">
            <div className="mx-auto max-w-screen-sm text-center">
              <h2 className="mb-6 text-3xl font-extrabold leading-tight text-white lg:text-4xl">
                Start managing your freezers today
              </h2>
              <p className="mb-8 font-light text-gray-300 text-lg leading-relaxed">
                Join thousands of users who trust Freezer Manager to keep their inventory organized and safe.
              </p>
              <Button size="xl" href="/signup" className="px-10 py-3">
                Create Free Account
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;