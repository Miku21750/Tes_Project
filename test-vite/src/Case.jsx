import React, { useEffect, useState } from 'react'
import { 
  ServiceCase
 } from './components/service-case'
import { useParams } from 'react-router'
import ApiCustomer from './api'

export const Case = () => {
  return (
    <ServiceCase></ServiceCase>
  )
}