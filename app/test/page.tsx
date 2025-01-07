'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

type Item = {
  id: string;
  title: string;
  desc: string;
  background: string;
};

export default function ViewPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://nextjs-boilerplate-eight-lemon-49.vercel.app/server/api/view');
        setItems(response.data.items);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>View Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
            <img src={item.background} alt={item.title} style={{ width: '200px', height: 'auto' }} />
          </li>
        ))}
      </ul>
    </div>
  );
} 