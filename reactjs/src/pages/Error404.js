import React from 'react'
import { Link } from 'react-router-dom'

export default function Error404() {
  return (
  <section class="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="text-center">
            <h2 class="d-flex justify-content-center align-items-center gap-2 mb-4">
              <span class="display-1 fw-bold">404</span>
            </h2>
            <h3 class="h2 mb-2">Oops! You're lost.</h3>
            <p class="mb-5">The page you are looking for was not found.</p>
            <Link class="btn btn-dark rounded-pill px-5 fs-6 m-0" to="/" role="button">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}
