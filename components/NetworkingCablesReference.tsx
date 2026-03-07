'use client'

import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Cable {
  id: string; name: string; cat: string; clab: string; desc: string
  spd: string; spdR: number; distM: number; dist: string; bw: string
  conn: string; shld: string; stds: string[]; protos: string[]
  vendors: string[]; poe: string; use: string; col: string; cbg: string
  cls: string; sT: string[]
  core?: string; jkt?: string; src?: string
}

interface SpdFilter { id: string; lbl: string; t: (c: Cable) => boolean }
interface DstFilter { id: string; lbl: string; t: (c: Cable) => boolean }



// ─── Data ─────────────────────────────────────────────────────────────────────

const CABLES: Cable[] = [
  // ── COPPER
  { id:'cat5e', name:'Cat5e', cat:'copper', clab:'Copper / RJ-45',
    desc:'Legacy 1G LAN. Still common in homes/SMB but not for new enterprise builds.',
    spd:'1 Gbps', spdR:1, distM:100, dist:'100 m',
    bw:'100 MHz', conn:'RJ-45 (8P8C)', shld:'UTP / STP',
    stds:['TIA/EIA-568-B.2','ISO/IEC 11801'],
    protos:['1000BASE-T (802.3ab)','100BASE-TX','PoE (802.3af)'],
    vendors:['Belden','CommScope','Panduit','Leviton','TrueCable'],
    poe:'PoE / PoE+ (15\u201330 W)', use:'Home, SMB, legacy infrastructure',
    col:'#fbbf24', cbg:'rgba(251,191,36,.1)', cls:'copper', sT:['1G'] },

  { id:'cat6', name:'Cat6', cat:'copper', clab:'Copper / RJ-45',
    desc:'10G at 55 m, 1G at 100 m. Spline separator cuts crosstalk. Solid mid-range choice.',
    spd:'10 Gbps', spdR:10, distM:100, dist:'100 m (1G) / 55 m (10G)',
    bw:'250 MHz', conn:'RJ-45 (8P8C)', shld:'UTP / STP',
    stds:['TIA/EIA-568-B.2-1','ISO/IEC 11801'],
    protos:['1000BASE-T (802.3ab)','10GBASE-T @55m (802.3an)','PoE+ (802.3at)'],
    vendors:['Belden','CommScope','Panduit','Corning','Leviton'],
    poe:'PoE+ (30 W)', use:'Office LAN, budget 10G at short range',
    col:'#fbbf24', cbg:'rgba(251,191,36,.1)', cls:'copper', sT:['10G'] },

  { id:'cat6a', name:'Cat6A', cat:'copper', clab:'Copper / RJ-45',
    desc:'2026 enterprise default. Full 10G at 100 m. Required for PoE++. 23 AWG.',
    spd:'10 Gbps', spdR:10, distM:100, dist:'100 m',
    bw:'500 MHz', conn:'RJ-45 (8P8C)', shld:'UTP / F/UTP / U/FTP',
    stds:['ANSI/TIA-568-C.2','ISO/IEC 11801 Class EA'],
    protos:['10GBASE-T (802.3an)','5GBASE-T (802.3bz)','PoE++ (802.3bt)'],
    vendors:['Belden','CommScope','Panduit','Corning','Siemon','R&M','TrueCable'],
    poe:'PoE++ Type 3/4 (60\u201390 W)', use:'Enterprise, Wi-Fi 6/7 APs, data center access',
    col:'#fbbf24', cbg:'rgba(251,191,36,.1)', cls:'copper', sT:['10G'] },

  { id:'cat7', name:'Cat7', cat:'copper', clab:'Copper / GG45/TERA',
    desc:'ISO/IEC only \u2013 NOT TIA-recognized in North America. Requires GG45 or TERA connectors, not RJ-45.',
    spd:'10 Gbps', spdR:10, distM:100, dist:'100 m (10G)',
    bw:'600 MHz', conn:'GG45 / TERA', shld:'S/FTP (mandatory)',
    stds:['ISO/IEC 11801 Class F'],
    protos:['10GBASE-T (802.3an)'],
    vendors:['Nexans','Belden','R&M','Legrand'],
    poe:'PoE+ (30 W)', use:'European enterprise, EMI-heavy environments',
    col:'#fbbf24', cbg:'rgba(251,191,36,.1)', cls:'copper', sT:['10G'] },

  { id:'cat8', name:'Cat8', cat:'copper', clab:'Copper / RJ-45',
    desc:'Data center intra-rack only. 30 m max. 25/40 Gbps. TIA Class I uses standard RJ-45.',
    spd:'40 Gbps', spdR:40, distM:30, dist:'30 m',
    bw:'2,000 MHz', conn:'RJ-45 (Class I) / GG45 (Class II)', shld:'S/FTP / F/FTP',
    stds:['ANSI/TIA-568-C.2-1','IEEE 802.3bq','ISO/IEC 11801-3'],
    protos:['25GBASE-T (802.3bq)','40GBASE-T (802.3bq)'],
    vendors:['Belden','Panduit','CommScope','Siemon','R&M'],
    poe:'Limited', use:'DC server-to-switch patching (\u226430 m)',
    col:'#fbbf24', cbg:'rgba(251,191,36,.1)', cls:'copper', sT:['40G'] },

  // ── MULTIMODE FIBER
  { id:'om1', name:'OM1', cat:'multimode', clab:'Multimode Fiber',
    desc:'Legacy 62.5 \u00b5m, LED source. Only for extending existing OM1 runs. Not for new builds.',
    spd:'1 Gbps', spdR:1, distM:275, dist:'275 m (1G)',
    bw:'200 MHz\u00b7km', conn:'LC / SC / ST / FC', shld:'N/A (optical)',
    stds:['ISO/IEC 11801 OM1','ANSI/TIA-568.3-D'],
    protos:['1000BASE-SX (802.3z)','100BASE-FX'],
    vendors:['Corning','Belden','Nexans','Furukawa'],
    core:'62.5/125 \u00b5m', jkt:'Orange', src:'LED',
    poe:'N/A', use:'Legacy systems only \u2013 not for new installs',
    col:'#4ade80', cbg:'rgba(74,222,128,.1)', cls:'multi', sT:['1G'] },

  { id:'om2', name:'OM2', cat:'multimode', clab:'Multimode Fiber',
    desc:'Standard 50 \u00b5m, LED. 550 m at 1G. Legacy but better than OM1. Outclassed by OM3+.',
    spd:'1 Gbps', spdR:1, distM:550, dist:'550 m (1G)',
    bw:'500 MHz\u00b7km', conn:'LC / SC', shld:'N/A',
    stds:['ISO/IEC 11801 OM2','ANSI/TIA-568.3-D'],
    protos:['1000BASE-SX (802.3z)','100BASE-SX'],
    vendors:['Corning','Belden','Nexans','TE Connectivity'],
    core:'50/125 \u00b5m', jkt:'Orange', src:'LED',
    poe:'N/A', use:'Legacy campus, low-speed short links',
    col:'#4ade80', cbg:'rgba(74,222,128,.1)', cls:'multi', sT:['1G'] },

  { id:'om3', name:'OM3', cat:'multimode', clab:'Multimode Fiber',
    desc:'Laser-optimized (VCSEL) 50 \u00b5m. 10G at 300 m; 40/100G via MPO. DC workhorse for a decade.',
    spd:'100 Gbps', spdR:100, distM:300, dist:'300 m (10G) / 70 m (100G)',
    bw:'2,000 MHz\u00b7km', conn:'LC / MPO-12', shld:'N/A',
    stds:['ISO/IEC 11801 OM3','ANSI/TIA-568.3-D','IEEE 802.3ae/ba/bm'],
    protos:['10GBASE-SR (802.3ae)','40GBASE-SR4 (802.3ba)','100GBASE-SR4 (802.3bm)'],
    vendors:['Corning','Panduit','CommScope','Belden','TE Connectivity','Furukawa'],
    core:'50/125 \u00b5m', jkt:'Aqua', src:'VCSEL 850 nm',
    poe:'N/A', use:'Data center horizontal, 10\u2013100G links',
    col:'#4ade80', cbg:'rgba(74,222,128,.1)', cls:'multi', sT:['100G'] },

  { id:'om4', name:'OM4', cat:'multimode', clab:'Multimode Fiber',
    desc:'Enhanced VCSEL 50 \u00b5m. 10G at 550 m; 40/100G at 150 m. Extended reach over OM3.',
    spd:'100 Gbps', spdR:100, distM:550, dist:'550 m (10G) / 150 m (100G)',
    bw:'4,700 MHz\u00b7km', conn:'LC / MPO-12/16', shld:'N/A',
    stds:['ISO/IEC 11801 OM4','ANSI/TIA-492AAAD','IEEE 802.3ae/ba'],
    protos:['10GBASE-SR','40GBASE-SR4','100GBASE-SR4','400GBASE-SR8 @50m'],
    vendors:['Corning','Panduit','CommScope','Belden','AFL','Prysmian'],
    core:'50/125 \u00b5m', jkt:'Aqua / Violet', src:'VCSEL 850 nm',
    poe:'N/A', use:'DC backbone, 40G/100G leaf-spine fabric',
    col:'#4ade80', cbg:'rgba(74,222,128,.1)', cls:'multi', sT:['100G'] },

  { id:'om5', name:'OM5 (WBMMF)', cat:'multimode', clab:'Multimode Fiber',
    desc:'Wideband 50 \u00b5m with SWDM over 4 wavelengths. One pair carries 4\u00d7100G = 400G. Lime green jacket.',
    spd:'400 Gbps', spdR:400, distM:150, dist:'150 m (SWDM 400G)',
    bw:'\u22654,700 MHz\u00b7km', conn:'LC / MPO-12/16', shld:'N/A',
    stds:['ISO/IEC 11801 OM5','TIA-492AAAE','IEEE 802.3bs'],
    protos:['SWDM4 100G/400G','100GBASE-SWDM4','400GBASE-SWDM4'],
    vendors:['Corning','Panduit','CommScope','AFL','Vitex'],
    core:'50/125 \u00b5m', jkt:'Lime Green', src:'VCSEL + SWDM 850\u2013940 nm',
    poe:'N/A', use:'AI/ML clusters, 400G+ DC, dense fiber reduction',
    col:'#4ade80', cbg:'rgba(74,222,128,.1)', cls:'multi', sT:['400G'] },

  // ── SINGLEMODE FIBER
  { id:'os1', name:'OS1', cat:'singlemode', clab:'Singlemode Fiber',
    desc:'Indoor singlemode, tight-buffered. Building risers and backbone up to ~2 km.',
    spd:'10 Gbps+', spdR:10, distM:2000, dist:'~2 km',
    bw:'Unlimited', conn:'LC / SC / FC', shld:'N/A',
    stds:['ISO/IEC 11801 OS1','ANSI/TIA-568.3-D'],
    protos:['10GBASE-LR (802.3ae)','1000BASE-LX (802.3z)'],
    vendors:['Corning','Belden','Nexans','Prysmian'],
    core:'9/125 \u00b5m', jkt:'Yellow', src:'Laser 1310 nm',
    poe:'N/A', use:'Building backbone risers, indoor long runs',
    col:'#38bdf8', cbg:'rgba(56,189,248,.1)', cls:'single', sT:['10G'] },

  { id:'os2', name:'OS2', cat:'singlemode', clab:'Singlemode Fiber',
    desc:'Low-water-peak singlemode. Universal for campus, WAN, inter-DC. Supports DWDM for 400G+ over 200 km.',
    spd:'400 Gbps+', spdR:400, distM:200000, dist:'~200 km (passive)',
    bw:'Unlimited', conn:'LC / SC / FC / MPO', shld:'N/A',
    stds:['ISO/IEC 11801 OS2','ANSI/TIA-568.3-D','ITU-T G.652D'],
    protos:['10GBASE-LR/ER (802.3ae)','100GBASE-LR4 (802.3ba)','400GBASE-LR8 (802.3bs)','DWDM / CWDM','GPON / XGS-PON'],
    vendors:['Corning','Prysmian','Nexans','Furukawa','AFL','CommScope'],
    core:'9/125 \u00b5m', jkt:'Yellow', src:'Laser 1310/1550 nm',
    poe:'N/A', use:'Campus WAN, inter-DC, telecom backbone, FTTH',
    col:'#38bdf8', cbg:'rgba(56,189,248,.1)', cls:'single', sT:['400G'] },

  // ── SERIAL
  { id:'rs232', name:'RS-232 (TIA-232)', cat:'serial', clab:'Serial Cable',
    desc:'Classic point-to-point DTE/DCE. De facto Cisco console port. Single-ended, 15 m max.',
    spd:'115 kbps', spdR:0.000115, distM:15, dist:'~15 m @ 9600 bps',
    bw:'N/A', conn:'DB9 (DE-9) / DB25', shld:'Single-ended',
    stds:['TIA/EIA-232-F (1997)'],
    protos:['Async serial','Console management','Modems'],
    vendors:['Belden','Moxa','Phoenix Contact','TE Connectivity','FTDI'],
    poe:'N/A', use:'Cisco console ports, lab equipment, legacy modems',
    col:'#a78bfa', cbg:'rgba(167,139,250,.1)', cls:'serial', sT:['<1G'] },

  { id:'rs422', name:'RS-422 (TIA-422)', cat:'serial', clab:'Serial Cable',
    desc:'Differential full-duplex. 1 tx / 10 rx. 10 Mbps short range, 100 kbps at 1.2 km. DMX512.',
    spd:'10 Mbps', spdR:0.01, distM:1000, dist:'1,200 m @ 100 kbps',
    bw:'N/A', conn:'DB25 / Terminal block', shld:'Balanced differential',
    stds:['TIA/EIA-422-B (1994)'],
    protos:['DMX512 (lighting)','Async serial'],
    vendors:['Belden','Phoenix Contact','Moxa','FTDI'],
    poe:'N/A', use:'Broadcast, DMX lighting, industrial 1-tx multipoint',
    col:'#a78bfa', cbg:'rgba(167,139,250,.1)', cls:'serial', sT:['<1G'] },

  { id:'rs485', name:'RS-485 (TIA-485)', cat:'serial', clab:'Serial Cable',
    desc:'Industrial multi-drop bus. 32+ nodes, half-duplex. Backbone of Modbus, Profibus, BACnet.',
    spd:'10 Mbps', spdR:0.01, distM:1000, dist:'1,200 m @ 100 kbps',
    bw:'N/A', conn:'Terminal block', shld:'Balanced differential',
    stds:['TIA/EIA-485-A (1998)'],
    protos:['Modbus RTU / ASCII','Profibus DP','BACnet MS/TP','DMX512','DALI'],
    vendors:['Belden','Phoenix Contact','Moxa','Lapp Group','B&B SmartWorx'],
    poe:'N/A', use:'PLCs, SCADA, BMS, industrial sensors',
    col:'#a78bfa', cbg:'rgba(167,139,250,.1)', cls:'serial', sT:['<1G'] },

  // ── USB
  { id:'usb2', name:'USB 2.0', cat:'usb', clab:'USB Cable',
    desc:'Hi-Speed USB. 480 Mbps. Ubiquitous for low-speed peripherals and charging.',
    spd:'480 Mbps', spdR:0.48, distM:5, dist:'5 m (passive)',
    bw:'N/A', conn:'Type-A / Type-B / Mini / Micro', shld:'Shielded',
    stds:['USB 2.0 (2000)','USB-IF','USB BC 1.2'],
    protos:['USB 2.0 Hi-Speed','USB BC 1.2 (7.5W)'],
    vendors:['Anker','Belkin','Cable Matters','TE Connectivity','Molex'],
    poe:'2.5\u20137.5 W (BC 1.2)', use:'Keyboards, mice, storage, chargers, embedded',
    col:'#fb7185', cbg:'rgba(251,113,133,.1)', cls:'usb', sT:['<1G'] },

  { id:'usb32', name:'USB 3.2 Gen2\u00d72 (20G)', cat:'usb', clab:'USB Cable',
    desc:'SuperSpeed+ USB. Gen2 = 10G (Type-A/C); Gen2\u00d72 = 20G (Type-C only). Fast external storage.',
    spd:'20 Gbps', spdR:20, distM:2, dist:'1\u20132 m (passive)',
    bw:'N/A', conn:'Type-A / Type-C', shld:'Shielded',
    stds:['USB 3.2 (2017)','USB-IF'],
    protos:['SuperSpeed USB 10G (Gen2)','SuperSpeed USB 20G (Gen2\u00d72)','USB-PD 3.0 (100W)'],
    vendors:['Anker','Belkin','Cable Matters','Plugable'],
    poe:'100 W (USB-PD 3.0)', use:'NVMe external drives, docking stations, displays',
    col:'#fb7185', cbg:'rgba(251,113,133,.1)', cls:'usb', sT:['20G'] },

  { id:'usb4', name:'USB4 Gen3\u00d72 (40G)', cat:'usb', clab:'USB Cable',
    desc:'Thunderbolt 3 based. 40G, tunnels USB 3.x + DP + PCIe. Type-C only. 0.8 m passive.',
    spd:'40 Gbps', spdR:40, distM:0.8, dist:'0.8 m passive / 2 m+ active',
    bw:'N/A', conn:'USB Type-C only', shld:'Active / Passive',
    stds:['USB4 v1.0 (2019)','USB-IF','TB3/4 compatible'],
    protos:['USB4 40Gbps','DisplayPort 2.0','PCIe tunneling','USB-PD 3.0 (100W)'],
    vendors:['Anker','Belkin','Cable Matters','Plugable','Intel (TB4)'],
    poe:'100 W (USB-PD 3.0)', use:'Laptop docking, 4K/8K displays, fast storage',
    col:'#fb7185', cbg:'rgba(251,113,133,.1)', cls:'usb', sT:['40G'] },

  { id:'usb4v2', name:'USB4 v2 (80G)', cat:'usb', clab:'USB Cable',
    desc:'Latest USB std (2022). 80G / 120G asymm. PAM-3. Thunderbolt 5 compatible. Rolling out 2025\u201326.',
    spd:'80 Gbps', spdR:80, distM:1.2, dist:'~1.2 m active (80G)',
    bw:'N/A', conn:'USB Type-C only', shld:'Active shielded',
    stds:['USB4 v2.0 (2022)','USB-IF','Thunderbolt 5'],
    protos:['USB4 80Gbps','DisplayPort 2.1','PCIe 4 tunneling','USB-PD 3.1 (240W)'],
    vendors:['Anker','Belkin','Cable Matters','Intel (TB5)'],
    poe:'240 W (USB-PD 3.1)', use:'8K displays, multi-monitor docking, AI edge',
    col:'#fb7185', cbg:'rgba(251,113,133,.1)', cls:'usb', sT:['80G'] },

  // ── DAC
  { id:'dac10', name:'DAC 10G SFP+', cat:'dac', clab:'DAC / Twinax',
    desc:'Twinax with integrated SFP+. No optics. Passive \u22647 m, active \u226415 m. Cheaper than optical.',
    spd:'10 Gbps', spdR:10, distM:7, dist:'~7 m passive / 15 m active',
    bw:'N/A', conn:'SFP+ (integrated)', shld:'Twinaxial',
    stds:['SFF-8431','IEEE 802.3ae 10GBASE-CR'],
    protos:['10GBASE-CR'],
    vendors:['Cisco','Arista','Juniper','Mellanox / NVIDIA','FS.com','CommScope'],
    poe:'N/A', use:'DC intra-rack switch-to-server, ToR uplinks',
    col:'#22d3ee', cbg:'rgba(34,211,238,.1)', cls:'dac', sT:['10G'] },

  { id:'dac100', name:'DAC 100G QSFP28', cat:'dac', clab:'DAC / Twinax',
    desc:'100G leaf-spine copper. QSFP28. Passive \u22645 m. Cheaper than optical for intra-rack links.',
    spd:'100 Gbps', spdR:100, distM:5, dist:'~5 m passive',
    bw:'N/A', conn:'QSFP28 (integrated)', shld:'Twinaxial',
    stds:['IEEE 802.3bm 100GBASE-CR4','SFF-8665'],
    protos:['100GBASE-CR4'],
    vendors:['Cisco','Arista','Mellanox / NVIDIA','FS.com','Amphenol'],
    poe:'N/A', use:'Leaf-spine copper, server-to-TOR, AI GPU clusters',
    col:'#22d3ee', cbg:'rgba(34,211,238,.1)', cls:'dac', sT:['100G'] },

  { id:'dac400', name:'DAC 400G QSFP-DD', cat:'dac', clab:'DAC / Twinax',
    desc:'AI/ML 400G intra-rack. QSFP-DD or OSFP. Passive \u22642 m, active \u22645 m. Competes with AOC.',
    spd:'400 Gbps', spdR:400, distM:5, dist:'~5 m active',
    bw:'N/A', conn:'QSFP-DD / OSFP (integrated)', shld:'Twinaxial',
    stds:['IEEE 802.3bs 400GBASE-CR8','CMIS 5.0'],
    protos:['400GBASE-CR8'],
    vendors:['Cisco','Arista','Mellanox / NVIDIA','Amphenol','FS.com'],
    poe:'N/A', use:'AI GPU-to-switch, hyperscale leaf-spine, HPC',
    col:'#22d3ee', cbg:'rgba(34,211,238,.1)', cls:'dac', sT:['400G'] },
]

const TYPECFG: Record<string, { lbl: string; cls: string; col: string }> = {
  copper:    { lbl: 'Copper / RJ-45',   cls: 'copper', col: '#fbbf24' },
  multimode: { lbl: 'Multimode Fiber',  cls: 'multi',  col: '#4ade80' },
  singlemode:{ lbl: 'Singlemode Fiber', cls: 'single', col: '#38bdf8' },
  serial:    { lbl: 'Serial (RS-xxx)',  cls: 'serial', col: '#a78bfa' },
  usb:       { lbl: 'USB Cable',        cls: 'usb',    col: '#fb7185' },
  dac:       { lbl: 'DAC / Twinax',     cls: 'dac',    col: '#22d3ee' },
}


const SPD: SpdFilter[] = [
  { id:'<1G',  lbl:'<1G',   t: c => c.sT.includes('<1G')  },
  { id:'1G',   lbl:'1G',    t: c => c.sT.includes('1G')   },
  { id:'10G',  lbl:'10G',   t: c => c.sT.includes('10G')  },
  { id:'20G',  lbl:'20G',   t: c => c.sT.includes('20G')  },
  { id:'40G',  lbl:'40G',   t: c => c.sT.includes('40G')  },
  { id:'80G',  lbl:'80G',   t: c => c.sT.includes('80G')  },
  { id:'100G', lbl:'100G',  t: c => c.sT.includes('100G') },
  { id:'400G', lbl:'400G+', t: c => c.sT.includes('400G') },
]

const DST: DstFilter[] = [
  { id:'\u22641m',   lbl:'\u22641 m',   t: c => c.distM <= 1    },
  { id:'\u226410m',  lbl:'\u226410 m',  t: c => c.distM <= 10   },
  { id:'\u2264100m', lbl:'\u2264100 m', t: c => c.distM <= 100  },
  { id:'\u22641km',  lbl:'\u22641 km',  t: c => c.distM <= 1000 },
  { id:'>1km',  lbl:'>1 km',  t: c => c.distM > 1000  },
]

const PRTS = [
  '1000BASE-T (802.3ab)', '10GBASE-T (802.3an)', '10GBASE-SR (802.3ae)',
  '10GBASE-LR (802.3ae)', '40GBASE-SR4 (802.3ba)', '100GBASE-SR4 (802.3bm)',
  '400GBASE-LR8 (802.3bs)', 'DWDM / CWDM',
  'PoE++ (802.3bt)', 'Modbus RTU / ASCII', 'Profibus DP', 'BACnet MS/TP',
  'USB4 40Gbps', 'USB4 80Gbps', 'SWDM4 100G/400G',
]

const VNDS = [
  'Corning','Belden','Panduit','CommScope','Prysmian','Nexans',
  'Siemon','R&M','Furukawa','AFL','Cisco','Arista',
  'Mellanox / NVIDIA','Moxa','Phoenix Contact','Anker','Belkin',
]


// ─── Component ────────────────────────────────────────────────────────────────

const CSS = `
.ncr { display:flex; height:100%; background:#0f1117; color:#cbd5e1; font-family:'IBM Plex Sans',sans-serif; overflow:hidden; }

/* Sidebar */
.ncr-sb {
  width:228px; flex-shrink:0; display:flex; flex-direction:column;
  background:rgba(18,23,35,.97); border-right:1px solid #2a3450;
  overflow-y:auto; overflow-x:hidden;
}
.ncr-sb::-webkit-scrollbar { width:3px; }
.ncr-sb::-webkit-scrollbar-thumb { background:#2a3450; border-radius:2px; }

.ncr-sb-brand { padding:.7rem .9rem .55rem; border-bottom:1px solid #2a3450; }
.ncr-sb-brand h2 { font-family:'JetBrains Mono',monospace; font-size:.75rem; font-weight:600; color:#fff; display:flex; align-items:center; gap:.4rem; }
.ncr-pulse { width:6px; height:6px; border-radius:50%; background:#22d3ee; animation:ncr-pulse 2s infinite; flex-shrink:0; }
@keyframes ncr-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
.ncr-sb-brand p { font-family:'JetBrains Mono',monospace; font-size:.55rem; color:#475569; margin-top:.15rem; padding-left:1rem; }

.ncr-sec { border-bottom:1px solid #2a3450; }
.ncr-sec-hd { display:flex; align-items:center; justify-content:space-between; padding:.5rem .9rem .45rem; cursor:pointer; user-select:none; }
.ncr-sec-hd:hover { background:rgba(255,255,255,.02); }
.ncr-sec-title { font-family:'JetBrains Mono',monospace; font-size:.57rem; letter-spacing:.1em; text-transform:uppercase; color:#64748b; display:flex; align-items:center; gap:.38rem; }
.ncr-sdot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.ncr-badge { font-family:'JetBrains Mono',monospace; font-size:.5rem; color:#22d3ee; background:rgba(34,211,238,.11); border:1px solid rgba(34,211,238,.28); padding:.02rem .3rem; border-radius:1rem; }
.ncr-chev { color:#475569; transition:transform .2s; flex-shrink:0; }
.ncr-chev.closed { transform:rotate(-90deg); }
.ncr-sec-body { padding:.3rem .65rem .5rem; }

/* Type filter buttons */
.ncr-fb {
  display:flex; align-items:center; gap:.4rem;
  width:100%; padding:.28rem .45rem; border-radius:.35rem;
  border:none; background:none; color:#64748b;
  font-family:'JetBrains Mono',monospace; font-size:.63rem; cursor:pointer; text-align:left;
  transition:background .13s,color .13s; white-space:nowrap; margin-bottom:.12rem;
}
.ncr-fb:hover { background:#252d42; color:#cbd5e1; }
.ncr-fb .ncr-fi { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.ncr-fb .ncr-fl { overflow:hidden; text-overflow:ellipsis; flex:1; }
.ncr-fb.on { background:rgba(34,211,238,.08); color:#22d3ee; }
.ncr-fb.on-copper { background:rgba(251,191,36,.1); color:#fbbf24; }
.ncr-fb.on-multi  { background:rgba(74,222,128,.1); color:#4ade80; }
.ncr-fb.on-single { background:rgba(56,189,248,.1); color:#38bdf8; }
.ncr-fb.on-serial { background:rgba(167,139,250,.1); color:#a78bfa; }
.ncr-fb.on-usb    { background:rgba(251,113,133,.1); color:#fb7185; }
.ncr-fb.on-dac    { background:rgba(34,211,238,.1);  color:#22d3ee; }

/* Tag buttons */
.ncr-tagrow { display:flex; flex-wrap:wrap; gap:.22rem; }
.ncr-tb {
  font-family:'JetBrains Mono',monospace; font-size:.57rem;
  padding:.15rem .38rem; border-radius:.28rem;
  border:1px solid #2a3450; background:#252d42; color:#64748b;
  cursor:pointer; transition:all .13s; white-space:nowrap;
}
.ncr-tb:hover { border-color:#3d4f78; color:#cbd5e1; }
.ncr-tb.on { background:rgba(34,211,238,.1); border-color:rgba(34,211,238,.4); color:#22d3ee; }
.ncr-tb.on-spd { background:rgba(251,191,36,.1); border-color:rgba(251,191,36,.4); color:#fbbf24; }
.ncr-tb.on-dst { background:rgba(74,222,128,.1); border-color:rgba(74,222,128,.4); color:#4ade80; }
.ncr-tb.on-prt { background:rgba(56,189,248,.1); border-color:rgba(56,189,248,.4); color:#38bdf8; }
.ncr-tb.on-vnd { background:rgba(167,139,250,.1); border-color:rgba(167,139,250,.4); color:#a78bfa; }

/* Active chips */
.ncr-astrip { padding:.38rem .65rem .32rem; display:flex; flex-wrap:wrap; gap:.2rem; min-height:0; }
.ncr-achip {
  font-family:'JetBrains Mono',monospace; font-size:.54rem;
  padding:.12rem .36rem; border-radius:1rem;
  background:rgba(34,211,238,.11); border:1px solid rgba(34,211,238,.28);
  color:#22d3ee; cursor:pointer; display:flex; align-items:center; gap:.2rem;
  transition:filter .13s; max-width:180px; overflow:hidden;
}
.ncr-achip span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ncr-achip:hover { filter:brightness(1.2); }
.ncr-achip .ncr-ax { opacity:.55; flex-shrink:0; }
.ncr-clrall {
  font-family:'JetBrains Mono',monospace; font-size:.54rem;
  padding:.12rem .36rem; border-radius:1rem;
  background:rgba(251,113,133,.09); border:1px solid rgba(251,113,133,.28);
  color:#fb7185; cursor:pointer; transition:filter .13s; white-space:nowrap;
}
.ncr-clrall:hover { filter:brightness(1.2); }

.ncr-sb-footer { margin-top:auto; padding:.55rem .9rem; border-top:1px solid #2a3450; font-family:'JetBrains Mono',monospace; font-size:.48rem; color:#475569; line-height:1.7; }

/* Content */
.ncr-content { flex:1; min-width:0; display:flex; flex-direction:column; overflow:hidden; }

.ncr-cbar {
  flex-shrink:0; height:38px; display:flex; align-items:center; gap:.75rem;
  padding:0 .85rem; border-bottom:1px solid #2a3450;
  background:rgba(20,25,38,.7);
}
.ncr-rcount { font-family:'JetBrains Mono',monospace; font-size:.64rem; color:#64748b; }
.ncr-rcount strong { color:#22d3ee; }
.ncr-sortsel {
  font-family:'JetBrains Mono',monospace; font-size:.62rem; color:#94a3b8;
  background:#1e2535; border:1px solid #2a3450; border-radius:.35rem;
  padding:.22rem .45rem; cursor:pointer; outline:none;
}
.ncr-detbtn {
  margin-left:auto; font-family:'JetBrains Mono',monospace; font-size:.62rem;
  color:#94a3b8; background:#1e2535; border:1px solid #2a3450; border-radius:.35rem;
  padding:.22rem .55rem; cursor:pointer; transition:all .15s; white-space:nowrap;
}
.ncr-detbtn:hover { border-color:#3d4f78; color:#e2e8f0; }
.ncr-detbtn.on { background:rgba(34,211,238,.1); border-color:rgba(34,211,238,.4); color:#22d3ee; }

/* Compare mini bar */
.ncr-cmpmini { display:flex; align-items:center; gap:.4rem; margin-left:auto; flex-wrap:wrap; }
.ncr-cchips { display:flex; gap:.22rem; flex-wrap:wrap; }
.ncr-cchip {
  font-family:'JetBrains Mono',monospace; font-size:.57rem;
  padding:.1rem .38rem; border-radius:1rem;
  background:#252d42; border:1px solid #2a3450;
  color:#cbd5e1; display:flex; align-items:center; gap:.22rem;
}
.ncr-cchip .ncr-cx { color:#fb7185; cursor:pointer; }
.ncr-cmpgo {
  font-family:'JetBrains Mono',monospace; font-size:.59rem;
  padding:.2rem .55rem; border-radius:.35rem;
  background:rgba(34,211,238,.11); border:1px solid rgba(34,211,238,.3);
  color:#22d3ee; cursor:pointer; transition:all .15s; white-space:nowrap;
}
.ncr-cmpgo:hover { background:rgba(34,211,238,.22); }
.ncr-cmpclr { background:none; border:none; color:#475569; cursor:pointer; font-size:.9rem; padding:.1rem; transition:color .15s; }
.ncr-cmpclr:hover { color:#fb7185; }

/* Grid */
.ncr-gridwrap { flex:1; overflow-y:auto; padding:.6rem; }
.ncr-gridwrap::-webkit-scrollbar { width:4px; }
.ncr-gridwrap::-webkit-scrollbar-thumb { background:#2a3450; border-radius:2px; }
.ncr-grid {
  display:grid; grid-template-columns:repeat(auto-fill,minmax(248px,1fr));
  gap:.5rem; align-content:start;
}

/* Card */
.ncr-card {
  background:#161b27; border:1px solid #2a3450; border-radius:.65rem;
  overflow:hidden; cursor:pointer;
  transition:border-color .2s,transform .16s,box-shadow .2s;
  animation:ncr-cin .28s ease backwards;
}
@keyframes ncr-cin { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
.ncr-card:hover { transform:translateY(-2px); box-shadow:0 5px 20px rgba(0,0,0,.5); }
.ncr-card.ncr-incmp { outline:2px solid var(--cc); outline-offset:-1px; }

.ncr-cstripe { height:2px; }
.ncr-chtop { padding:.52rem .75rem .32rem; display:flex; align-items:center; justify-content:space-between; gap:.35rem; }
.ncr-cname { font-family:'JetBrains Mono',monospace; font-size:.82rem; font-weight:600; color:#fff; line-height:1.2; }
.ncr-ccat {
  font-family:'JetBrains Mono',monospace; font-size:.5rem; letter-spacing:.07em; text-transform:uppercase;
  padding:.1rem .36rem; border-radius:1rem; white-space:nowrap; flex-shrink:0; border:1px solid;
}

.ncr-cstats { display:grid; grid-template-columns:repeat(3,1fr); gap:.28rem; padding:0 .75rem .38rem; }
.ncr-sbox { background:#1e2535; border:1px solid #2a3450; border-radius:.33rem; padding:.25rem .32rem; text-align:center; }
.ncr-slbl { font-family:'JetBrains Mono',monospace; font-size:.46rem; color:#475569; text-transform:uppercase; letter-spacing:.07em; display:block; margin-bottom:.02rem; }
.ncr-sval { font-family:'JetBrains Mono',monospace; font-size:.62rem; color:#cbd5e1; font-weight:600; }

.ncr-cdesc { padding:0 .75rem .4rem; font-size:.66rem; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-family:'IBM Plex Sans',sans-serif; }

.ncr-ctoggle {
  display:flex; align-items:center; justify-content:center; gap:.28rem;
  width:100%; padding:.28rem; border-top:1px solid #2a3450;
  font-family:'JetBrains Mono',monospace; font-size:.57rem; color:#475569;
  background:none; border-left:none; border-right:none; border-bottom:none;
  cursor:pointer; transition:all .15s;
}
.ncr-ctoggle:hover { color:#22d3ee; background:rgba(34,211,238,.06); }
.ncr-ctoggle svg { transition:transform .22s; }
.ncr-ctoggle.open svg { transform:rotate(180deg); }

/* Expand area */
.ncr-cdetail { max-height:0; overflow:hidden; transition:max-height .38s ease,opacity .28s; opacity:0; }
.ncr-cdetail.open { max-height:700px; opacity:1; }
.ncr-dinn { padding:.52rem .75rem .72rem; border-top:1px solid #2a3450; }
.ncr-dgrid { display:grid; grid-template-columns:1fr 1fr; gap:.35rem .5rem; margin-bottom:.52rem; }
.ncr-drow { display:flex; flex-direction:column; gap:.05rem; }
.ncr-dkey { font-family:'JetBrains Mono',monospace; font-size:.49rem; text-transform:uppercase; letter-spacing:.08em; color:#475569; }
.ncr-dval { font-family:'JetBrains Mono',monospace; font-size:.65rem; color:#e2e8f0; }
.ncr-dtags { display:flex; flex-wrap:wrap; gap:.2rem; margin-bottom:.42rem; }
.ncr-dtag { font-family:'JetBrains Mono',monospace; font-size:.52rem; padding:.08rem .34rem; border-radius:.2rem; border:1px solid; }
.ncr-dtag.s { color:#38bdf8; border-color:rgba(56,189,248,.28); background:rgba(56,189,248,.07); }
.ncr-dtag.p { color:#4ade80; border-color:rgba(74,222,128,.28); background:rgba(74,222,128,.07); }
.ncr-dtag.v { color:#a78bfa; border-color:rgba(167,139,250,.28); background:rgba(167,139,250,.07); }
.ncr-dbtns { display:flex; gap:.25rem; flex-wrap:wrap; }
.ncr-dbtn {
  font-family:'JetBrains Mono',monospace; font-size:.56rem;
  padding:.16rem .44rem; border-radius:.3rem;
  border:1px solid #2a3450; background:#252d42; color:#64748b; cursor:pointer; transition:all .13s;
}
.ncr-dbtn:hover { color:#e2e8f0; border-color:#3d4f78; }

/* No results */
.ncr-nores { grid-column:1/-1; text-align:center; padding:3rem 2rem; font-family:'JetBrains Mono',monospace; color:#475569; }
.ncr-nores-ico { font-size:2rem; margin-bottom:.6rem; opacity:.35; }

/* Compare modal */
.ncr-overlay {
  position:absolute; inset:0; z-index:200;
  background:rgba(0,0,0,.72); backdrop-filter:blur(5px);
  display:flex; align-items:center; justify-content:center; padding:2rem;
}
.ncr-modal {
  background:#161b27; border:1px solid #2a3450; border-radius:.9rem;
  width:100%; max-width:820px; max-height:76%; overflow:hidden;
  display:flex; flex-direction:column; animation:ncr-moin .2s ease;
}
@keyframes ncr-moin { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
.ncr-mhd { padding:.85rem 1.1rem; border-bottom:1px solid #2a3450; display:flex; align-items:center; justify-content:space-between; }
.ncr-mtitle { font-family:'JetBrains Mono',monospace; font-size:.72rem; color:#22d3ee; letter-spacing:.08em; text-transform:uppercase; }
.ncr-mclose { background:none; border:none; color:#64748b; cursor:pointer; font-size:1rem; padding:.15rem; transition:color .15s; }
.ncr-mclose:hover { color:#fb7185; }
.ncr-mbody { overflow-y:auto; padding:1rem; }
.ncr-ctbl { width:100%; border-collapse:collapse; }
.ncr-ctbl th,.ncr-ctbl td { padding:.42rem .55rem; border-bottom:1px solid #2a3450; font-family:'JetBrains Mono',monospace; font-size:.63rem; text-align:left; }
.ncr-ctbl th { color:#94a3b8; font-size:.55rem; text-transform:uppercase; letter-spacing:.08em; background:#1e2535; }
.ncr-ctbl td:first-child { color:#64748b; white-space:nowrap; }
.ncr-ctbl tr:hover td { background:#1e2535; }
.ncr-cmpname { font-weight:600; color:#fff!important; }
.ncr-best { color:#4ade80!important; font-weight:600; }

/* Search box */
.ncr-search {
  display:flex; align-items:center; gap:.4rem;
  background:#1e2535; border:1px solid #2a3450; border-radius:.45rem;
  padding:.26rem .6rem; flex-shrink:0; transition:border-color .18s,box-shadow .18s;
}
.ncr-search:focus-within { border-color:#0891b2; box-shadow:0 0 0 2px rgba(34,211,238,.11); }
.ncr-sinput { flex:1; background:none; border:none; outline:none; font-family:'JetBrains Mono',monospace; font-size:.71rem; color:#e2e8f0; caret-color:#22d3ee; min-width:0; }
.ncr-sinput::placeholder { color:#475569; }
.ncr-sesc { font-family:'JetBrains Mono',monospace; font-size:.56rem; color:#475569; border:1px solid #2a3450; border-radius:.2rem; padding:.02rem .26rem; cursor:pointer; background:none; transition:color .15s; flex-shrink:0; }
.ncr-sesc:hover { color:#22d3ee; }

/* Mobile filter toggle button (shown only on small screens) */
.ncr-filter-btn {
  display:none; align-items:center; gap:.35rem;
  font-family:'JetBrains Mono',monospace; font-size:.65rem;
  padding:.22rem .55rem; border-radius:.35rem;
  border:1px solid #2a3450; background:#1e2535; color:#94a3b8;
  cursor:pointer; transition:all .15s; flex-shrink:0; white-space:nowrap;
}
.ncr-filter-btn:hover { border-color:#3d4f78; color:#e2e8f0; }
.ncr-filter-btn .ncr-fbadge {
  background:rgba(34,211,238,.15); border:1px solid rgba(34,211,238,.35);
  color:#22d3ee; border-radius:1rem; font-size:.52rem;
  padding:.01rem .28rem; line-height:1.4;
}

/* Mobile filter drawer overlay */
.ncr-drawer-overlay {
  display:none; position:absolute; inset:0; z-index:100;
  background:rgba(0,0,0,.55); backdrop-filter:blur(3px);
}
.ncr-drawer-overlay.open { display:block; }
.ncr-drawer {
  position:absolute; top:0; left:0; bottom:0;
  width:260px; max-width:85vw;
  background:rgba(18,23,35,.98); border-right:1px solid #2a3450;
  display:flex; flex-direction:column; overflow:hidden;
  transform:translateX(-100%); transition:transform .25s ease;
  z-index:101;
}
.ncr-drawer.open { transform:translateX(0); }
.ncr-drawer-inner { flex:1; overflow-y:auto; overflow-x:hidden; }
.ncr-drawer-inner::-webkit-scrollbar { width:3px; }
.ncr-drawer-inner::-webkit-scrollbar-thumb { background:#2a3450; }

/* Mobile search bar in cbar (visible only on mobile) */
.ncr-mobile-search { display:none; flex:1; }

@media (max-width: 767px) {
  .ncr-sb { display:none; }
  .ncr-filter-btn { display:flex; }
  .ncr-drawer-overlay { display:none; }
  .ncr-drawer-overlay.open { display:block; }
  .ncr-mobile-search { display:flex; }
  /* hide desktop sidebar search on mobile (it's in the drawer) */
  .ncr-sb-search { display:none; }
  /* tighten the grid for narrow screens */
  .ncr-grid { grid-template-columns:1fr; }
  /* hide compare chip names on very small screens, keep count readable */
  .ncr-cchips { display:none; }
  /* shorten cbar height to accommodate search row below */
  .ncr-cbar { height:auto; flex-wrap:wrap; padding:.45rem .7rem; gap:.4rem; }
}

@media (min-width: 480px) and (max-width:767px) {
  .ncr-grid { grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); }
  .ncr-cchips { display:flex; }
}
`

function togSet<T>(prev: Set<T>, val: T): Set<T> {
  const next = new Set(prev)
  next.has(val) ? next.delete(val) : next.add(val)
  return next
}

// ─── Drawer Section ───────────────────────────────────────────────────────────
function DrawerSection({ label, dot, badge, secId, closed, togSection, children }: {
  label: string; dot: string; badge: number; secId: string
  closed: Set<string>; togSection: (id: string) => void; children: React.ReactNode
}) {
  return (
    <div className="ncr-sec">
      <div className="ncr-sec-hd" onClick={() => togSection(secId)}>
        <div className="ncr-sec-title">
          <span className="ncr-sdot" style={{ background: dot }} />
          {label}
          {badge > 0 && <span className="ncr-badge">{badge}</span>}
        </div>
        <Chev closed={closed.has(secId)} />
      </div>
      {!closed.has(secId) && <div className="ncr-sec-body">{children}</div>}
    </div>
  )
}

// ─── Chevron SVG ──────────────────────────────────────────────────────────────
function Chev({ closed }: { closed: boolean }) {
  return (
    <svg
      className={`ncr-chev${closed ? ' closed' : ''}`}
      width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NetworkingCablesReference() {
  const [aTypes,   setATypes]   = useState<Set<string>>(new Set())
  const [aSpeeds,  setASpeeds]  = useState<Set<string>>(new Set())
  const [aDists,   setADists]   = useState<Set<string>>(new Set())
  const [aProtos,  setAProtos]  = useState<Set<string>>(new Set())
  const [aVendors, setAVendors] = useState<Set<string>>(new Set())
  const [sq,       setSq]       = useState('')
  const [cmpSet,   setCmpSet]   = useState<Set<string>>(new Set())
  const [sortOrder,setSortOrder]= useState('name')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [showAllDetails, setShowAllDetails] = useState(false)
  const [closed,   setClosed]   = useState<Set<string>>(new Set(['sp','sv','sq']))
  const [showCmp,    setShowCmp]    = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  function reset() {
    setATypes(new Set()); setASpeeds(new Set()); setADists(new Set())
    setAProtos(new Set()); setAVendors(new Set()); setSq('')
  }

  function togSection(id: string) {
    setClosed(prev => togSet(prev, id))
  }

  function togCard(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setExpanded(prev => togSet(prev, id))
  }

  function addCmp(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setCmpSet(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 5) next.add(id)
      return next
    })
  }

  function rmCmp(id: string) {
    setCmpSet(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  const filtered = useMemo(() => {
    return CABLES.filter(c => {
      if (aTypes.size && !aTypes.has(c.cat)) return false
      if (aSpeeds.size && ![...aSpeeds].some(id => { const o = SPD.find(o => o.id === id); return o && o.t(c) })) return false
      if (aDists.size  && ![...aDists].some(id  => { const o = DST.find(o => o.id === id); return o && o.t(c) })) return false
      if (aProtos.size && ![...aProtos].some(p => c.protos.some(cp =>
        cp.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(cp.toLowerCase())
      ))) return false
      if (aVendors.size && ![...aVendors].some(v => c.vendors.some(cv => cv === v || cv.includes(v)))) return false
      if (sq) {
        const q = sq.toLowerCase()
        const hay = [c.name,c.clab,c.desc,c.spd,c.dist,c.conn,c.shld,...c.protos,...c.stds,...c.vendors,c.poe,c.use].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    }).sort((a, b) => {
      if (sortOrder === 'speed') return b.spdR - a.spdR
      if (sortOrder === 'dist')  return b.distM - a.distM
      if (sortOrder === 'type')  return a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name)
      return a.name.localeCompare(b.name)
    })
  }, [aTypes, aSpeeds, aDists, aProtos, aVendors, sq, sortOrder])

  const activeFilters = useMemo(() => {
    const all: Array<{ lbl: string; rm: () => void }> = []
    aTypes.forEach(v   => all.push({ lbl: TYPECFG[v]?.lbl || v, rm: () => setATypes(prev => togSet(prev, v)) }))
    aSpeeds.forEach(v  => all.push({ lbl: v,   rm: () => setASpeeds(prev => togSet(prev, v)) }))
    aDists.forEach(v   => all.push({ lbl: v,   rm: () => setADists(prev => togSet(prev, v)) }))
    aProtos.forEach(v  => all.push({ lbl: v,   rm: () => setAProtos(prev => togSet(prev, v)) }))
    aVendors.forEach(v => all.push({ lbl: v,   rm: () => setAVendors(prev => togSet(prev, v)) }))
    if (sq) all.push({ lbl: `"${sq}"`, rm: () => setSq('') })
    return all
  }, [aTypes, aSpeeds, aDists, aProtos, aVendors, sq])

  const cmpCables = useMemo(() => [...cmpSet].map(id => CABLES.find(c => c.id === id)!).filter(Boolean), [cmpSet])
  const maxS = useMemo(() => Math.max(...cmpCables.map(c => c.spdR)), [cmpCables])
  const maxD = useMemo(() => Math.max(...cmpCables.map(c => c.distM)), [cmpCables])

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="ncr" style={{ position: 'relative' }}>
      <style>{CSS}</style>

      {/* ── MOBILE FILTER DRAWER ───────────────────────────────────── */}
      <div
        className={`ncr-drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      >
        <div className={`ncr-drawer${drawerOpen ? ' open' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="ncr-drawer-inner">
            <div className="ncr-sb-brand" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.65rem .9rem' }}>
              <div>
                <h2 style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.75rem', fontWeight:600, color:'#fff', display:'flex', alignItems:'center', gap:'.4rem' }}>
                  <span className="ncr-pulse" />Filters
                </h2>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'1rem', lineHeight:1 }}>&#x2715;</button>
            </div>
            {/* Search */}
            <div style={{ padding:'.5rem .65rem .3rem' }}>
              <div className="ncr-search">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input className="ncr-sinput" type="text" placeholder="search cables..." autoComplete="off" spellCheck={false} value={sq} onChange={e => setSq(e.target.value)} />
                {sq && <button className="ncr-sesc" onClick={() => setSq('')}>&#x2715;</button>}
              </div>
            </div>
            {/* Type */}
            <DrawerSection label="Cable Type" dot="#22d3ee" badge={aTypes.size} secId="dst" closed={closed} togSection={togSection}>
              {Object.entries(TYPECFG).map(([k, c]) => {
                const isOn = aTypes.has(k)
                return (
                  <button key={k} className={`ncr-fb${isOn ? ` on-${c.cls}` : ''}`} onClick={() => { setATypes(prev => togSet(prev, k)); setDrawerOpen(false) }}>
                    <span className="ncr-fi" style={{ background: c.col, opacity: isOn ? 1 : 0.4 }} />
                    <span className="ncr-fl">{c.lbl}</span>
                  </button>
                )
              })}
            </DrawerSection>
            {/* Speed */}
            <DrawerSection label="Speed" dot="#fbbf24" badge={aSpeeds.size} secId="dss" closed={closed} togSection={togSection}>
              <div className="ncr-tagrow">
                {SPD.map(o => <button key={o.id} className={`ncr-tb${aSpeeds.has(o.id) ? ' on-spd' : ''}`} onClick={() => setASpeeds(prev => togSet(prev, o.id))}>{o.lbl}</button>)}
              </div>
            </DrawerSection>
            {/* Distance */}
            <DrawerSection label="Distance" dot="#4ade80" badge={aDists.size} secId="dsd" closed={closed} togSection={togSection}>
              <div className="ncr-tagrow">
                {DST.map(o => <button key={o.id} className={`ncr-tb${aDists.has(o.id) ? ' on-dst' : ''}`} onClick={() => setADists(prev => togSet(prev, o.id))}>{o.lbl}</button>)}
              </div>
            </DrawerSection>
            {/* Protocol */}
            <DrawerSection label="Protocol / Std" dot="#38bdf8" badge={aProtos.size} secId="dsp" closed={closed} togSection={togSection}>
              <div className="ncr-tagrow">
                {PRTS.map(p => <button key={p} className={`ncr-tb${aProtos.has(p) ? ' on-prt' : ''}`} onClick={() => setAProtos(prev => togSet(prev, p))}>{p}</button>)}
              </div>
            </DrawerSection>
            {/* Vendor */}
            <DrawerSection label="Vendor" dot="#a78bfa" badge={aVendors.size} secId="dsv" closed={closed} togSection={togSection}>
              <div className="ncr-tagrow">
                {VNDS.map(v => <button key={v} className={`ncr-tb${aVendors.has(v) ? ' on-vnd' : ''}`} onClick={() => setAVendors(prev => togSet(prev, v))}>{v}</button>)}
              </div>
            </DrawerSection>
            {/* Active chips */}
            {activeFilters.length > 0 && (
              <div className="ncr-astrip">
                {activeFilters.map((f, i) => (
                  <span key={i} className="ncr-achip" onClick={f.rm}><span>{f.lbl}</span><span className="ncr-ax">&#x2715;</span></span>
                ))}
                {activeFilters.length > 1 && <button className="ncr-clrall" onClick={() => { reset(); setDrawerOpen(false) }}>Clear all</button>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SIDEBAR ────────────────────────────────────────────────── */}
      <aside className="ncr-sb">
        <div className="ncr-sb-brand">
          <h2><span className="ncr-pulse" />Networking Cables</h2>
          <p>// 2026 edition &middot; 21 cable types</p>
        </div>

        {/* Search in sidebar */}
        <div style={{ padding: '.5rem .65rem .3rem' }}>
          <div className="ncr-search">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="ncr-sinput"
              type="text"
              placeholder="search cables..."
              autoComplete="off"
              spellCheck={false}
              value={sq}
              onChange={e => setSq(e.target.value)}
            />
            {sq && (
              <button className="ncr-sesc" onClick={() => setSq('')}>&#x2715;</button>
            )}
          </div>
        </div>

        {/* Cable Type */}
        <div className="ncr-sec">
          <div className="ncr-sec-hd" onClick={() => togSection('st')}>
            <div className="ncr-sec-title">
              <span className="ncr-sdot" style={{ background: '#22d3ee' }} />
              Cable Type
              {aTypes.size > 0 && <span className="ncr-badge">{aTypes.size}</span>}
            </div>
            <Chev closed={closed.has('st')} />
          </div>
          {!closed.has('st') && (
            <div className="ncr-sec-body">
              {Object.entries(TYPECFG).map(([k, c]) => {
                const isOn = aTypes.has(k)
                return (
                  <button
                    key={k}
                    className={`ncr-fb${isOn ? ` on-${c.cls}` : ''}`}
                    onClick={() => setATypes(prev => togSet(prev, k))}
                  >
                    <span className="ncr-fi" style={{ background: c.col, opacity: isOn ? 1 : 0.4 }} />
                    <span className="ncr-fl">{c.lbl}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Speed */}
        <div className="ncr-sec">
          <div className="ncr-sec-hd" onClick={() => togSection('ss')}>
            <div className="ncr-sec-title">
              <span className="ncr-sdot" style={{ background: '#fbbf24' }} />
              Speed
              {aSpeeds.size > 0 && <span className="ncr-badge">{aSpeeds.size}</span>}
            </div>
            <Chev closed={closed.has('ss')} />
          </div>
          {!closed.has('ss') && (
            <div className="ncr-sec-body">
              <div className="ncr-tagrow">
                {SPD.map(o => (
                  <button
                    key={o.id}
                    className={`ncr-tb${aSpeeds.has(o.id) ? ' on-spd' : ''}`}
                    onClick={() => setASpeeds(prev => togSet(prev, o.id))}
                  >{o.lbl}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Distance */}
        <div className="ncr-sec">
          <div className="ncr-sec-hd" onClick={() => togSection('sd')}>
            <div className="ncr-sec-title">
              <span className="ncr-sdot" style={{ background: '#4ade80' }} />
              Distance
              {aDists.size > 0 && <span className="ncr-badge">{aDists.size}</span>}
            </div>
            <Chev closed={closed.has('sd')} />
          </div>
          {!closed.has('sd') && (
            <div className="ncr-sec-body">
              <div className="ncr-tagrow">
                {DST.map(o => (
                  <button
                    key={o.id}
                    className={`ncr-tb${aDists.has(o.id) ? ' on-dst' : ''}`}
                    onClick={() => setADists(prev => togSet(prev, o.id))}
                  >{o.lbl}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Protocol */}
        <div className="ncr-sec">
          <div className="ncr-sec-hd" onClick={() => togSection('sp')}>
            <div className="ncr-sec-title">
              <span className="ncr-sdot" style={{ background: '#38bdf8' }} />
              Protocol / Std
              {aProtos.size > 0 && <span className="ncr-badge">{aProtos.size}</span>}
            </div>
            <Chev closed={closed.has('sp')} />
          </div>
          {!closed.has('sp') && (
            <div className="ncr-sec-body">
              <div className="ncr-tagrow">
                {PRTS.map(p => (
                  <button
                    key={p}
                    className={`ncr-tb${aProtos.has(p) ? ' on-prt' : ''}`}
                    onClick={() => setAProtos(prev => togSet(prev, p))}
                  >{p}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vendor */}
        <div className="ncr-sec">
          <div className="ncr-sec-hd" onClick={() => togSection('sv')}>
            <div className="ncr-sec-title">
              <span className="ncr-sdot" style={{ background: '#a78bfa' }} />
              Vendor
              {aVendors.size > 0 && <span className="ncr-badge">{aVendors.size}</span>}
            </div>
            <Chev closed={closed.has('sv')} />
          </div>
          {!closed.has('sv') && (
            <div className="ncr-sec-body">
              <div className="ncr-tagrow">
                {VNDS.map(v => (
                  <button
                    key={v}
                    className={`ncr-tb${aVendors.has(v) ? ' on-vnd' : ''}`}
                    onClick={() => setAVendors(prev => togSet(prev, v))}
                  >{v}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="ncr-astrip">
            {activeFilters.map((f, i) => (
              <span key={i} className="ncr-achip" onClick={f.rm}>
                <span>{f.lbl}</span>
                <span className="ncr-ax">&#x2715;</span>
              </span>
            ))}
            {activeFilters.length > 1 && (
              <button className="ncr-clrall" onClick={reset}>Clear all</button>
            )}
          </div>
        )}

        <div style={{ flex: 1 }} />
        <div className="ncr-sb-footer">
          IEEE 802.3 &middot; ANSI/TIA-568<br />ISO/IEC 11801 &middot; USB-IF &middot; EIA/TIA
        </div>
      </aside>

      {/* ── CONTENT ────────────────────────────────────────────────── */}
      <div className="ncr-content">
        {/* Top bar */}
        <div className="ncr-cbar">
          {/* Mobile filter toggle */}
          <button className="ncr-filter-btn" onClick={() => setDrawerOpen(true)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
            Filters
            {activeFilters.length > 0 && <span className="ncr-fbadge">{activeFilters.length}</span>}
          </button>
          {/* Mobile search (shown only on small screens) */}
          <div className="ncr-mobile-search">
            <div className="ncr-search" style={{ width: '100%' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input className="ncr-sinput" type="text" placeholder="search cables..." autoComplete="off" spellCheck={false} value={sq} onChange={e => setSq(e.target.value)} />
              {sq && <button className="ncr-sesc" onClick={() => setSq('')}>&#x2715;</button>}
            </div>
          </div>
          <div className="ncr-rcount">
            <strong>{filtered.length}</strong> cable{filtered.length !== 1 ? 's' : ''} shown
          </div>
          <select
            className="ncr-sortsel"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="name">Sort: Name</option>
            <option value="speed">Sort: Speed ↓</option>
            <option value="dist">Sort: Distance ↓</option>
            <option value="type">Sort: Type</option>
          </select>

          {/* Show/hide all details */}
          {(() => {
            const anyOpen = showAllDetails || expanded.size > 0
            return (
              <button
                className={`ncr-detbtn${anyOpen ? ' on' : ''}`}
                onClick={() => {
                  if (anyOpen) {
                    setShowAllDetails(false)
                    setExpanded(new Set())
                  } else {
                    setShowAllDetails(true)
                  }
                }}
              >
                {anyOpen ? 'Hide details' : 'Show details'}
              </button>
            )
          })()}

          {/* Compare mini */}
          {cmpSet.size > 0 && (
            <div className="ncr-cmpmini">
              <div className="ncr-cchips">
                {cmpCables.map(c => (
                  <div key={c.id} className="ncr-cchip">
                    <span style={{ color: c.col }}>{c.name}</span>
                    <span className="ncr-cx" onClick={() => rmCmp(c.id)}>&#x2715;</span>
                  </div>
                ))}
              </div>
              <button
                className="ncr-cmpgo"
                onClick={() => { if (cmpSet.size >= 2) setShowCmp(true) }}
              >Compare</button>
              <button className="ncr-cmpclr" onClick={() => setCmpSet(new Set())}>&#x2715;</button>
            </div>
          )}
        </div>

        {/* Card grid */}
        <div className="ncr-gridwrap">
          <div className="ncr-grid">
            {filtered.length === 0 ? (
              <div className="ncr-nores">
                <div className="ncr-nores-ico">&#x1F50D;</div>
                <p>
                  No matches.{' '}
                  <span
                    style={{ color: '#22d3ee', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={reset}
                  >Clear filters</span>
                </p>
              </div>
            ) : filtered.map((c, i) => {
              const isExp = expanded.has(c.id) || showAllDetails
              const inCmp = cmpSet.has(c.id)
              const distDisp = c.distM >= 200000 ? '200 km' : c.distM >= 1000 ? (c.distM / 1000).toFixed(0) + ' km' : c.distM + ' m'
              const connShort = c.conn.split('/')[0].trim().split(' ')[0]
              return (
                <div
                  key={c.id}
                  className={`ncr-card${inCmp ? ' ncr-incmp' : ''}`}
                  style={{ animationDelay: `${i * 0.028}s`, ['--cc' as string]: c.col } as React.CSSProperties}
                >
                  <div className="ncr-cstripe" style={{ background: `linear-gradient(90deg,${c.col},transparent)` }} />
                  <div className="ncr-chtop">
                    <div className="ncr-cname">{c.name}</div>
                    <div className="ncr-ccat" style={{ color: c.col, borderColor: c.col + '55', background: c.cbg }}>
                      {c.clab}
                    </div>
                  </div>
                  <div className="ncr-cstats">
                    <div className="ncr-sbox">
                      <span className="ncr-slbl">Speed</span>
                      <span className="ncr-sval" style={{ color: c.col }}>{c.spd}</span>
                    </div>
                    <div className="ncr-sbox">
                      <span className="ncr-slbl">Distance</span>
                      <span className="ncr-sval">{distDisp}</span>
                    </div>
                    <div className="ncr-sbox">
                      <span className="ncr-slbl">Connector</span>
                      <span className="ncr-sval">{connShort}</span>
                    </div>
                  </div>
                  <div className="ncr-cdesc">{c.desc}</div>
                  <button
                    className={`ncr-ctoggle${isExp ? ' open' : ''}`}
                    style={isExp ? { color: c.col, background: c.cbg } : undefined}
                    onClick={e => togCard(c.id, e)}
                  >
                    <span>Details</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div className={`ncr-cdetail${isExp ? ' open' : ''}`}>
                    <div className="ncr-dinn">
                      <div className="ncr-dgrid">
                        <div className="ncr-drow"><span className="ncr-dkey">Bandwidth</span><span className="ncr-dval">{c.bw}</span></div>
                        <div className="ncr-drow"><span className="ncr-dkey">Connector</span><span className="ncr-dval">{c.conn}</span></div>
                        <div className="ncr-drow"><span className="ncr-dkey">Shielding</span><span className="ncr-dval">{c.shld}</span></div>
                        <div className="ncr-drow"><span className="ncr-dkey">PoE</span><span className="ncr-dval">{c.poe}</span></div>
                        {c.core && <div className="ncr-drow"><span className="ncr-dkey">Core/Clad</span><span className="ncr-dval">{c.core}</span></div>}
                        {c.src  && <div className="ncr-drow"><span className="ncr-dkey">Light Src</span><span className="ncr-dval">{c.src}</span></div>}
                        {c.jkt  && <div className="ncr-drow"><span className="ncr-dkey">Jacket</span><span className="ncr-dval">{c.jkt}</span></div>}
                        <div className="ncr-drow" style={{ gridColumn: '1/-1' }}>
                          <span className="ncr-dkey">Use Case</span>
                          <span className="ncr-dval">{c.use}</span>
                        </div>
                      </div>
                      <div className="ncr-dtags">
                        {c.stds.map(s    => <span key={s} className="ncr-dtag s">{s}</span>)}
                        {c.protos.map(p  => <span key={p} className="ncr-dtag p">{p}</span>)}
                        {c.vendors.map(v => <span key={v} className="ncr-dtag v">{v}</span>)}
                      </div>
                      <div className="ncr-dbtns">
                        <button
                          className="ncr-dbtn"
                          onClick={e => addCmp(c.id, e)}
                        >{inCmp ? '✓ In compare' : '+ Compare'}</button>
                        <button
                          className="ncr-dbtn"
                          onClick={e => { e.stopPropagation(); reset(); setAVendors(new Set([c.vendors[0]])) }}
                        >&#x1F4E6; {c.vendors[0]}</button>
                        <button
                          className="ncr-dbtn"
                          onClick={e => { e.stopPropagation(); reset(); setATypes(new Set([c.cat])) }}
                        >&#x223C; Similar</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── COMPARE MODAL ──────────────────────────────────────────── */}
      {showCmp && (
        <div className="ncr-overlay" onClick={e => { if (e.target === e.currentTarget) setShowCmp(false) }}>
          <div className="ncr-modal">
            <div className="ncr-mhd">
              <div className="ncr-mtitle">// Side-by-Side Comparison</div>
              <button className="ncr-mclose" onClick={() => setShowCmp(false)}>&#x2715;</button>
            </div>
            <div className="ncr-mbody">
              <table className="ncr-ctbl">
                <thead>
                  <tr>
                    <th>Property</th>
                    {cmpCables.map(c => (
                      <th key={c.id} className="ncr-cmpname" style={{ color: c.col }}>{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    ['Category',  (c: Cable) => c.clab],
                    ['Max Speed', (c: Cable) => c.spd],
                    ['Distance',  (c: Cable) => c.dist],
                    ['Bandwidth', (c: Cable) => c.bw],
                    ['Connector', (c: Cable) => c.conn],
                    ['Shielding', (c: Cable) => c.shld],
                    ['PoE',       (c: Cable) => c.poe],
                    ['Standards', (c: Cable) => c.stds.slice(0,2).join(', ')],
                    ['Protocols', (c: Cable) => c.protos.slice(0,2).join(', ')],
                    ['Vendors',   (c: Cable) => c.vendors.slice(0,3).join(', ')],
                    ['Use Case',  (c: Cable) => c.use],
                  ] as [string, (c: Cable) => string][]).map(([lbl, fn]) => (
                    <tr key={lbl}>
                      <td>{lbl}</td>
                      {cmpCables.map(c => {
                        const best =
                          (lbl === 'Max Speed' && c.spdR === maxS) ||
                          (lbl === 'Distance'  && c.distM === maxD)
                        return <td key={c.id} className={best ? 'ncr-best' : ''}>{fn(c)}</td>
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
