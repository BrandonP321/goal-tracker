import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

type PageNotFoundProps = {}

/** 404 should redirect to user dashboard */
export default function PageNotFound({}: PageNotFoundProps) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/Dashboard", { replace: true })
  }, [])

  return (
    null
  )
}