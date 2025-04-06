export interface Alphabet {
  character: string;
  name: string;
  pronunciation: string;
  audio: string;
  strokes: string[];
  id: number;
}

// Complete Hindi Alphabet System
export const alphabets: Alphabet[] = [
  { character: "क", name: "क (ka)", pronunciation: "Pronounced as 'k' in 'kite'", audio: "hindi_क.mp3", strokes: ["M11,23 L16,33", "M16,33 L26,43"],id:11 },
  { character: "ख", name: "ख (kha)", pronunciation: "Pronounced as 'kh' in 'Khalid'", audio: "hindi_ख.mp3", strokes: ["M12,24 L17,34", "M17,34 L27,44", "M25,42 L30,52"],id:12 },
  { character: "ग", name: "ग (ga)", pronunciation: "Pronounced as 'g' in 'go'", audio: "hindi_ग.mp3", strokes: ["M13,25 L18,35", "M18,35 L28,45"],id:13 },
  { character: "घ", name: "घ (gha)", pronunciation: "Pronounced as 'gh' in 'ghost'", audio: "hindi_घ.mp3", strokes: ["M14,26 L19,36", "M19,36 L29,46", "M27,44 L32,54"],id:14 },
  { character: "ङ", name: "ङ (nga)", pronunciation: "Nasal sound 'nga'", audio: "hindi_ङ.mp3", strokes: ["M15,27 L20,37", "M20,37 L30,47"],id:15 },
  { character: "च", name: "च (cha)", pronunciation: "Pronounced as 'ch' in 'chair'", audio: "hindi_च.mp3", strokes: ["M16,28 L21,38", "M21,38 L31,48"],id:16 },
  { character: "छ", name: "छ (chha)", pronunciation: "Pronounced as 'chh' in 'church'", audio: "hindi_छ.mp3", strokes: ["M17,29 L22,39", "M22,39 L32,49", "M30,47 L35,57"],id:17 },
  { character: "ज", name: "ज (ja)", pronunciation: "Pronounced as 'j' in 'jug'", audio: "hindi_ज.mp3", strokes: ["M18,30 L23,40", "M23,40 L33,50"],id:18 },
  { character: "झ", name: "झ (jha)", pronunciation: "Pronounced as 'jh' in 'jhula'", audio: "hindi_झ.mp3", strokes: ["M19,31 L24,41", "M24,41 L34,51", "M32,49 L37,59"],id:19 },
  { character: "ञ", name: "ञ (nya)", pronunciation: "Nasal sound 'nya'", audio: "hindi_ञ.mp3", strokes: ["M20,32 L25,42", "M25,42 L35,52"],id:20 },
  { character: "ट", name: "ट (ṭa)", pronunciation: "Pronounced as 't' in 'tame' (retroflex)", audio: "hindi_ट.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20"],id:21 },
  { character: "ठ", name: "ठ (ṭha)", pronunciation: "Aspirated 'ṭha'", audio: "hindi_ठ.mp3", strokes: ["M10,10 L10,30", "M5,15 L15,15", "M5,25 L15,25"],id:22 },
  { character: "ड", name: "ड (ḍa)", pronunciation: "Pronounced as 'd' in 'doll' (retroflex)", audio: "hindi_ड.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20", "M5,25 L10,30"],id:23 },
  { character: "ढ", name: "ढ (ḍha)", pronunciation: "Aspirated 'ḍha'", audio: "hindi_ढ.mp3", strokes: ["M10,10 L10,30", "M5,15 L15,15", "M5,25 L10,30"],id:24 },
  { character: "ण", name: "ण (ṇa)", pronunciation: "Retroflex nasal sound 'ṇa'", audio: "hindi_ण.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20", "M5,25 L10,30"],id:25 },
  { character: "त", name: "त (ta)", pronunciation: "Pronounced as 't' in 'table' (dental)", audio: "hindi_त.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20"],id:26 },
  { character: "थ", name: "थ (tha)", pronunciation: "Aspirated 'tha'", audio: "hindi_थ.mp3", strokes: ["M10,10 L10,30", "M5,15 L15,15", "M5,25 L15,25"],id:27 },
  { character: "द", name: "द (da)", pronunciation: "Pronounced as 'd' in 'dog' (dental)", audio: "hindi_द.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20", "M5,25 L10,30"],id:28 },
  { character: "न", name: "न (na)", pronunciation: "Pronounced as 'n' in 'name'", audio: "hindi_न.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20", "M5,25 L10,30"],id:29 },
  { character: "प", name: "प (pa)", pronunciation: "Pronounced as 'p' in 'pen'", audio: "hindi_प.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20"],id:30 },
  { character: "फ", name: "फ (pha)", pronunciation: "Pronounced as ph in phone", audio: "hindi_फ.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20", "M8,5 L18,10"],id:31 },
  { character: "ब", name: "ब (ba)", pronunciation: "Pronounced as b in bat", audio: "hindi_ब.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20", "M5,10 L15,5"],id:32 },
  { character: "म", name: "म (ma)", pronunciation: "Pronounced as m in man", audio: "hindi_म.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20", "M5,15 L15,10"],id:33 },
  { character: "य", name: "य (ya)", pronunciation: "Pronounced as y in yes", audio: "hindi_य.mp3", strokes: ["M10,10 L10,30", "M5,15 L15,10", "M5,25 L15,20"],id:34 },
  { character: "र", name: "र (ra)", pronunciation: "Pronounced as r in rat", audio: "hindi_र.mp3", strokes: ["M5,10 L15,20", "M10,10 L10,30"],id:35 },
  { character: "ल", name: "ल (la)", pronunciation: "Pronounced as l in lion", audio: "hindi_ल.mp3", strokes: ["M10,10 L10,30", "M5,25 L15,20"],id:36 },
  { character: "व", name: "व (wa)", pronunciation: "Pronounced as व in what", audio: "hindi_व.mp3", strokes: ["M5,10 L15,20", "M10,10 L10,30", "M5,25 L15,20"],id:37 },
  { character: "श", name: "श (sha)", pronunciation: "Pronounced as श in shore", audio: "hindi_श.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20", "M8,5 L18,10"],id:38 },
  { character: "ष", name: "ष (shha)", pronunciation: "Pronounced as ष in she", audio: "hindi_ष.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20", "M8,5 L18,10", "M5,5 L15,10"],id:39 },
  { character: "स", name: "स (sa)", pronunciation: "Pronounced as स in sale", audio: "hindi_स.mp3", strokes: ["M5,10 L15,20", "M10,10 L10,30", "M5,25 L15,20"],id:40 },
  { character: "ह", name: "ह (ha)", pronunciation: "Pronounced as ह in hi", audio: "hindi_ह.mp3", strokes: ["M10,10 L10,30", "M5,15 L15,10", "M5,25 L15,20"],id:41 },
  { character: "क्ष", name: "क्ष (kṣa)", pronunciation: "Pronounced as क्ष in kshatriya", audio: "hindi_क्ष.mp3", strokes: ["M5,10 L15,20", "M10,10 L10,30", "M5,25 L15,20", "M5,5 L15,10"],id:42 },
  { character: "त्र", name: "त्र (tra)", pronunciation: "Pronounced as त्र in try", audio: "hindi_त्र.mp3", strokes: ["M10,10 L10,30", "M5,20 L15,20", "M8,5 L18,10", "M5,5 L15,10"],id:43 },
  { character: "ज्ञ", name: "ज्ञ (gya)", pronunciation: "Pronounced as ज्ञ in gyan", audio: "hindi_ज्ञ.mp3", strokes: ["M5,10 L15,20", "M10,10 L10,30", "M5,25 L15,20", "M5,5 L15,10"],id:44 },
  { character: "अ", name: "अ (a)", pronunciation: "Pronounced as 'a' in 'about'", audio: "hindi_अ.mp3", strokes: ["M1,10 L5,20", "M5,20 L15,30"], id:1 },
  { character: "आ", name: "आ (aa)", pronunciation: "Pronounced as 'a' in 'father'", audio: "hindi_आ.mp3", strokes: ["M2,12 L7,22", "M7,22 L17,32", "M15,30 L20,40"],id:2 },
  { character: "इ", name: "इ (i)", pronunciation: "Pronounced as 'i' in 'sit'", audio: "hindi_इ.mp3", strokes: ["M3,14 L8,24", "M8,24 L18,34"],id:3 },
  { character: "ई", name: "ई (ee)", pronunciation: "Pronounced as 'ee' in 'feet'", audio: "hindi_ई.mp3", strokes: ["M4,15 L9,25", "M9,25 L19,35", "M17,33 L22,43"],id:4 },
  { character: "उ", name: "उ (u)", pronunciation: "Pronounced as 'u' in 'put'", audio: "hindi_उ.mp3", strokes: ["M5,16 L10,26", "M10,26 L20,36"],id:5 },
  { character: "ऊ", name: "ऊ (oo)", pronunciation: "Pronounced as 'oo' in 'boot'", audio: "hindi_ऊ.mp3", strokes: ["M6,18 L11,28", "M11,28 L21,38", "M19,36 L24,46"],id:6 },
  { character: "ए", name: "ए (e)", pronunciation: "Pronounced as 'e' in 'bed'", audio: "hindi_ए.mp3", strokes: ["M7,19 L12,29", "M12,29 L22,39"] , id:7},
  { character: "ऐ", name: "ऐ (ai)", pronunciation: "Pronounced as 'ai' in 'fair'", audio: "hindi_ऐ.mp3", strokes: ["M8,20 L13,30", "M13,30 L23,40", "M21,38 L26,48"],id:8 },
  { character: "ओ", name: "ओ (o)", pronunciation: "Pronounced as 'o' in 'go'", audio: "hindi_ओ.mp3", strokes: ["M9,21 L14,31", "M14,31 L24,41"] ,id:9},
  { character: "औ", name: "औ (au)", pronunciation: "Pronounced as 'au' in 'caught'", audio: "hindi_औ.mp3", strokes: ["M10,22 L15,32", "M15,32 L25,42", "M23,40 L28,50"],id:10 },
  ];
