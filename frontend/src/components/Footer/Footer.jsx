import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="mt-6 py-10 text-white bg-blue-950 hover:text-gray-300 border-t-2 border-t-black">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between">
          <div className="w-full p-4 md:w-5/12">
            <p className="text-sm">
              &copy; Copyright 2024. All Rights Reserved by Mohd Asad Ansari.
            </p>
          </div>
          <div className="w-full p-4 md:w-2/12">
            <h3 className="tracking-wider mb-4 text-xs font-semibold uppercase">
              Company
            </h3>
            <ul>
              <li className="mb-4">
                <Link className="text-base font-medium hover:text-gray-300" to="/">
                  Features
                </Link>
              </li>
              <li className="mb-4">
                <Link className="text-base font-medium hover:text-gray-300" to="/">
                  Pricing
                </Link>
              </li>
              <li className="mb-4">
                <Link className="text-base font-medium hover:text-gray-300" to="/">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link className="text-base font-medium hover:text-gray-300" to="/">
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full p-4 md:w-2/12">
            <h3 className="tracking-wider mb-4 text-xs font-semibold uppercase">
              Support
            </h3>
            <ul>
              <li className="mb-4">
                <Link className="text-base font-medium hover:text-gray-300" to="/">
                  Account
                </Link>
              </li>
              <li className="mb-4">
                <Link className="text-base font-medium hover:text-gray-300" to="/">
                  Help
                </Link>
              </li>
              <li className="mb-4">
                <Link className="text-base font-medium hover:text-gray-300" to="/">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="text-base font-medium hover:text-gray-300" to="/">
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full p-4 md:w-3/12">
            <h3 className="tracking-wider mb-4 text-xs font-semibold uppercase">
              Legals
            </h3>
            <ul>
              <li className="mb-4">
                <Link className="text-base font-medium hover:text-gray-300" to="/">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li className="mb-4">
                <Link className="text-base font-medium hover:text-gray-300" to="/">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="text-base font-medium hover:text-gray-300" to="/">
                  Licensing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
