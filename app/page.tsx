'use client';

import { useMemo, useState } from 'react';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function randomInt(min: number, max: number) {
  const mn = Math.ceil(min);
  const mx = Math.floor(max);
  return Math.floor(Math.random() * (mx - mn + 1)) + mn;
}

function generatePassword(length: number, sets: { lower: boolean; upper: boolean; number: boolean; symbol: boolean }) {
  const lowers = 'abcdefghijklmnopqrstuvwxyz';
  const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.?/';
  const pools: string[] = [];
  if (sets.lower) pools.push(lowers);
  if (sets.upper) pools.push(uppers);
  if (sets.number) pools.push(numbers);
  if (sets.symbol) pools.push(symbols);
  if (pools.length === 0) return '';

  const all = pools.join('');
  const mandatory = pools.map(pool => pool[Math.floor(Math.random() * pool.length)]);
  const remaining = Array.from({ length: Math.max(0, length - mandatory.length) }, () => all[Math.floor(Math.random() * all.length)]);
  const raw = [...mandatory, ...remaining];
  // Fisher-Yates shuffle
  for (let i = raw.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [raw[i], raw[j]] = [raw[j], raw[i]];
  }
  return raw.join('');
}

function toHex(n: number) {
  return n.toString(16).padStart(2, '0');
}

export default function Page() {
  // Random Number
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [randNum, setRandNum] = useState<string>('');

  // Password
  const [pwLen, setPwLen] = useState<number>(16);
  const [pwLower, setPwLower] = useState(true);
  const [pwUpper, setPwUpper] = useState(true);
  const [pwNum, setPwNum] = useState(true);
  const [pwSym, setPwSym] = useState(false);
  const [password, setPassword] = useState('');

  // Color
  const [color, setColor] = useState<string>('');

  // UUID
  const [uuid, setUuid] = useState<string>('');

  // Coin & Dice
  const [coin, setCoin] = useState('');
  const [diceSides, setDiceSides] = useState<number>(6);
  const [dice, setDice] = useState<number | ''>('');

  // Choices
  const [choices, setChoices] = useState<string>('');
  const [picked, setPicked] = useState<string>('');

  // Quote
  const quotes = useMemo(
    () => [
      'Luck is what happens when preparation meets opportunity. ? Seneca',
      'The best way to predict the future is to invent it. ? Alan Kay',
      'Simplicity is the soul of efficiency. ? Austin Freeman',
      'Programs must be written for people to read. ? Harold Abelson',
      'Make it work, make it right, make it fast. ? Kent Beck',
    ],
    []
  );
  const [quote, setQuote] = useState('');

  function copy(text: string) {
    if (!text) return;
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="h1">Randomizer</div>
          <div className="badge">Numbers ? Passwords ? Colors ? UUID ? Coin ? Dice ? Choices ? Quotes</div>
        </div>
        <button className="btn secondary" onClick={() => window.location.reload()}>Reset</button>
      </div>

      <div className="grid">
        {/* Random Number */}
        <section className="card span-6">
          <h2>Random Number</h2>
          <div className="row">
            <input className="input" type="number" value={min} onChange={e => setMin(Number(e.target.value))} placeholder="Min" />
            <input className="input" type="number" value={max} onChange={e => setMax(Number(e.target.value))} placeholder="Max" />
            <button className="btn" onClick={() => setRandNum(String(randomInt(Math.min(min, max), Math.max(min, max))))}>Generate</button>
            <button className="btn secondary" onClick={() => copy(randNum)}>Copy</button>
          </div>
          <div className="output">{randNum || '?'}</div>
        </section>

        {/* Password */}
        <section className="card span-6">
          <h2>Secure Password</h2>
          <div className="row">
            <input className="input" type="number" value={pwLen} onChange={e => setPwLen(clamp(Number(e.target.value), 4, 128))} />
            <label className="row"><input type="checkbox" checked={pwLower} onChange={e => setPwLower(e.target.checked)} />&nbsp;lower</label>
            <label className="row"><input type="checkbox" checked={pwUpper} onChange={e => setPwUpper(e.target.checked)} />&nbsp;upper</label>
            <label className="row"><input type="checkbox" checked={pwNum} onChange={e => setPwNum(e.target.checked)} />&nbsp;numbers</label>
            <label className="row"><input type="checkbox" checked={pwSym} onChange={e => setPwSym(e.target.checked)} />&nbsp;symbols</label>
            <button className="btn" onClick={() => setPassword(generatePassword(pwLen, { lower: pwLower, upper: pwUpper, number: pwNum, symbol: pwSym }))}>Generate</button>
            <button className="btn secondary" onClick={() => copy(password)}>Copy</button>
          </div>
          <div className="output">{password || '?'}</div>
        </section>

        {/* Color */}
        <section className="card span-4">
          <h2>Random Color</h2>
          <div className="row">
            <button
              className="btn"
              onClick={() => {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
                setColor(hex);
              }}
            >Generate</button>
            <button className="btn secondary" onClick={() => copy(color)}>Copy</button>
          </div>
          <div className="output">
            <div className="swatch" style={{ background: color || 'transparent' }} />
            <div style={{ marginTop: 8 }}>{color || '?'}</div>
          </div>
        </section>

        {/* UUID */}
        <section className="card span-4">
          <h2>UUID (v4)</h2>
          <div className="row">
            <button className="btn" onClick={() => setUuid(globalThis.crypto?.randomUUID?.() ?? '')}>Generate</button>
            <button className="btn secondary" onClick={() => copy(uuid)}>Copy</button>
          </div>
          <div className="output">{uuid || '?'}</div>
        </section>

        {/* Coin */}
        <section className="card span-4">
          <h2>Coin Flip</h2>
          <div className="row">
            <button className="btn" onClick={() => setCoin(Math.random() < 0.5 ? 'Heads' : 'Tails')}>Flip</button>
            <button className="btn secondary" onClick={() => copy(coin)}>Copy</button>
          </div>
          <div className="output">{coin || '?'}</div>
        </section>

        {/* Dice */}
        <section className="card span-4">
          <h2>Dice Roller</h2>
          <div className="row">
            <select className="select" value={diceSides} onChange={e => setDiceSides(Number(e.target.value))}>
              {[4,6,8,10,12,20,100].map(n => <option key={n} value={n}>d{n}</option>)}
            </select>
            <button className="btn" onClick={() => setDice(randomInt(1, diceSides))}>Roll</button>
            <button className="btn secondary" onClick={() => copy(String(dice))}>Copy</button>
          </div>
          <div className="output">{dice === '' ? '?' : dice}</div>
        </section>

        {/* Choice Picker */}
        <section className="card span-4">
          <h2>Choice Picker</h2>
          <div className="row" style={{ width: '100%' }}>
            <textarea
              className="input"
              style={{ width: '100%', height: 84 }}
              placeholder={"Enter choices, one per line"}
              value={choices}
              onChange={e => setChoices(e.target.value)}
            />
          </div>
          <div className="row">
            <button
              className="btn"
              onClick={() => {
                const items = choices.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
                if (items.length === 0) { setPicked(''); return; }
                setPicked(items[Math.floor(Math.random() * items.length)]);
              }}
            >Pick</button>
            <button className="btn secondary" onClick={() => copy(picked)}>Copy</button>
          </div>
          <div className="output">{picked || '?'}</div>
        </section>

        {/* Quote */}
        <section className="card span-12">
          <h2>Random Quote</h2>
          <div className="row">
            <button className="btn" onClick={() => setQuote(quotes[Math.floor(Math.random() * quotes.length)])}>Inspire Me</button>
            <button className="btn secondary" onClick={() => copy(quote)}>Copy</button>
          </div>
          <div className="output">{quote || '?'}</div>
        </section>
      </div>

      <div className="footer">Built with Next.js ? Deployed on Vercel</div>
    </div>
  );
}
