import React from 'react'
import { useLocation } from 'react-router-dom';
export default function TermsPage() {
  const location = useLocation();
  const type = new URLSearchParams(location.search).get('type') || 'service';

  return (
    <div>TermsPage</div>
  )
}
