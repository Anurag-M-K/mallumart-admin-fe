import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
    return (
        <section className=" mt-28 md:mt-0 flex items-center justify-center bg-white font-serif">
            <div className=" ">
                <div className="flex justify-center">
                    <div className="text-center">
                        <div className="bg-cover bg-center h-auto w-auto md:h-96 md:w-96  bg-[url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')] flex items-center justify-center">
                            <h1 className="text-8xl">404</h1>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-2xl font-bold">Look like you're lost</h3>
                            <p className="mt-2">The page you are looking for is not available!</p>
                            <Link to="/" className="text-white px-4 py-2 bg-green-600 mt-4 inline-block">
                                Go to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ErrorPage;
