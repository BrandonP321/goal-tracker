import React from 'react'
import { Navigate } from 'react-router-dom'

type PageNotFoundProps = {}

/** 404 should redirect to user dashboard */
export default function PageNotFound({}: PageNotFoundProps) {

  return (
    <Navigate to={"/Dashboard"}/>
  )
}