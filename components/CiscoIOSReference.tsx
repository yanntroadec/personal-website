'use client'

import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Cmd = [string, string]

interface Group {
  label: string
  col: string
  cmds: Cmd[]
}

interface FlowBranch {
  id: string
  label: string
}

interface FlowNode {
  id: string
  label: string
  prompt: string
  branches?: FlowBranch[]
}

interface Mode {
  id: string
  name: string
  prompt: string
  col: string
  desc: string
  enter: string
  groups: Group[]
}

interface DeviceData {
  label: string
  acc: string
  flow: FlowNode[]
  modes: Mode[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROUTER: DeviceData = {
  label: 'Router',
  acc: '#22d3ee',
  flow: [
    { id: 'user', label: 'User EXEC', prompt: 'Router>' },
    { id: 'enable', label: 'Privileged EXEC', prompt: 'Router#' },
    {
      id: 'config', label: 'Global Config', prompt: 'Router(config)#',
      branches: [
        { id: 'interface', label: 'Interface (config-if)' },
        { id: 'subif', label: 'Subinterface (config-subif)' },
        { id: 'line', label: 'Line con/vty/aux (config-line)' },
        { id: 'ospf', label: 'Router OSPF (config-router)' },
        { id: 'eigrp', label: 'Router EIGRP (config-router)' },
        { id: 'rip', label: 'Router RIP (config-router)' },
        { id: 'bgp', label: 'Router BGP (config-router)' },
        { id: 'dhcp', label: 'DHCP Pool (dhcp-config)' },
        { id: 'acl', label: 'Named ACL (config-std/ext-nacl)' },
      ]
    }
  ],
  modes: [
    {
      id: 'user', name: 'User EXEC', prompt: 'Router>', col: '#4488dd',
      desc: 'Entry point after login. Very restricted — read-only. No configuration possible.',
      enter: 'Default on console/SSH/Telnet login (before typing enable)',
      groups: [
        { label: 'Navigation', col: '#4488dd', cmds: [
          ['enable', 'Enter Privileged EXEC mode (prompts for enable secret)'],
          ['logout / exit', 'Terminate the session'],
        ]},
        { label: 'Basic Diagnostics', col: '#4488dd', cmds: [
          ['ping <ip>', 'ICMP echo — test basic reachability'],
          ['ping <ip> repeat <n>', 'Send N pings (default 5)'],
          ['traceroute <ip>', 'Trace Layer 3 path hop by hop'],
          ['show version', 'IOS version, uptime, hardware model, memory'],
          ['show clock', 'Current date and time on the device'],
          ['show ip interface brief', 'One-line summary: IP, status, protocol (read-only)'],
        ]},
      ]
    },
    {
      id: 'enable', name: 'Privileged EXEC', prompt: 'Router#', col: '#dd8822',
      desc: 'Full read access. All show commands, debug, and file operations. Entry point to configuration mode.',
      enter: 'Router> enable',
      groups: [
        { label: 'Mode Navigation', col: '#dd8822', cmds: [
          ['configure terminal', 'Enter Global Configuration mode'],
          ['disable', 'Return to User EXEC'],
          ['exit / logout', 'End the session'],
        ]},
        { label: 'Show — System', col: '#dd8822', cmds: [
          ['show running-config', 'Active config currently in RAM'],
          ['show startup-config', 'Config saved in NVRAM (used on next boot)'],
          ['show version', 'IOS version, interfaces, memory, uptime, register'],
          ['show clock', 'System clock'],
          ['show users', 'Currently logged-in users and their lines'],
          ['show history', 'Recent command history buffer'],
          ['show processes cpu', 'CPU utilization per process'],
          ['show processes memory', 'Memory usage per process'],
          ['show ip interface brief', 'All interfaces: IP, status, protocol (one line each)'],
          ['show interfaces', 'Full counters and status for all interfaces'],
          ['show interfaces <int>', 'Detail for a single specific interface'],
          ['show controllers <int>', 'Hardware info — DCE vs DTE (used on serial links)'],
        ]},
        { label: 'Show — Routing', col: '#dd8822', cmds: [
          ['show ip route', 'Complete IPv4 routing table'],
          ['show ip route <ip>', 'Route lookup for specific destination'],
          ['show ip protocols', 'Active routing protocols, networks, timers, AD'],
          ['show ip ospf neighbor', 'OSPF adjacency table — state, priority, dead timer'],
          ['show ip ospf database', 'OSPF LSDB — all LSA types'],
          ['show ip ospf interface', 'OSPF per-interface detail — cost, DR/BDR, timers'],
          ['show ip eigrp neighbors', 'EIGRP neighbor table — uptime, Q cnt, RTO'],
          ['show ip eigrp topology', 'EIGRP topology table — successors, FD, AD'],
          ['show ip eigrp topology all-links', 'Full topology including non-feasible routes'],
          ['show ip bgp summary', 'BGP peer status and prefix counts'],
          ['show ip bgp', 'Full BGP routing table'],
          ['show ip rip database', 'RIP learned routes and timers'],
          ['show ip route summary', 'Count of routes by source protocol'],
        ]},
        { label: 'Show — Services', col: '#dd8822', cmds: [
          ['show ip nat translations', 'Active NAT/PAT translation table'],
          ['show ip nat statistics', 'NAT counters: hits, misses, expired entries'],
          ['clear ip nat translation *', 'Flush all dynamic NAT entries'],
          ['show ip dhcp binding', 'Active DHCP leases — IP to MAC mappings'],
          ['show ip dhcp pool', 'DHCP pool config and remaining addresses'],
          ['show ip dhcp conflict', 'IPs that caused conflicts (skipped)'],
          ['show access-lists', 'All ACLs with per-ACE match counters'],
          ['show ip access-lists', 'IPv4 ACLs only'],
          ['show ntp status', 'NTP sync status, stratum, reference clock'],
          ['show ntp associations', 'NTP peers, stratum, offset, jitter'],
          ['show cdp neighbors', 'Directly connected Cisco neighbors (brief)'],
          ['show cdp neighbors detail', 'Full CDP — IP, platform, IOS, capabilities'],
          ['show lldp neighbors', 'LLDP neighbor table'],
          ['show lldp neighbors detail', 'Full LLDP detail per neighbor'],
          ['show ip ssh', 'SSH version and active session info'],
          ['show logging', 'Syslog buffer contents and logging config'],
          ['show crypto isakmp sa', 'IKE phase 1 SAs (VPN)'],
          ['show crypto ipsec sa', 'IPsec phase 2 SAs (VPN)'],
        ]},
        { label: 'File Operations', col: '#dd8822', cmds: [
          ['copy running-config startup-config', 'Save running config to NVRAM (wr mem equivalent)'],
          ['copy running-config tftp:', 'Back up config to TFTP server'],
          ['copy tftp: running-config', 'Load config from TFTP into running config'],
          ['copy tftp: startup-config', 'Load config from TFTP into startup config'],
          ['write erase', 'Erase startup config — factory reset on next reload'],
          ['dir flash:', 'List files in flash memory'],
          ['show flash:', 'Flash contents with file sizes'],
          ['delete flash:<file>', 'Delete file from flash'],
          ['reload', 'Reboot (prompts to save if unsaved changes)'],
          ['reload in <min>', 'Schedule reload in N minutes'],
          ['reload cancel', 'Cancel a scheduled reload'],
        ]},
        { label: 'Debug (caution — CPU intensive)', col: '#dd8822', cmds: [
          ['debug ip ospf events', 'Real-time OSPF events — hello, state changes'],
          ['debug ip ospf adj', 'OSPF adjacency forming and dropping'],
          ['debug ip eigrp', 'EIGRP packet and topology events'],
          ['debug ip rip', 'RIP update packets sent and received'],
          ['debug ip nat', 'NAT translation events'],
          ['debug ip bgp', 'BGP keepalive, update, notification events'],
          ['undebug all', 'Stop ALL active debugs immediately — critical!'],
          ['terminal monitor', 'Forward debug output to current remote session'],
          ['terminal no monitor', 'Stop debug output on this session'],
        ]},
      ]
    },
    {
      id: 'config', name: 'Global Config', prompt: 'Router(config)#', col: '#bb44cc',
      desc: 'Top-level configuration mode. Affects the entire router. Entry point to all sub-configuration modes.',
      enter: 'Router# configure terminal',
      groups: [
        { label: 'Identity & Basics', col: '#bb44cc', cmds: [
          ['hostname <name>', 'Set router hostname — changes the CLI prompt'],
          ['banner motd # <text> #', 'Message of the Day — displayed before login prompt'],
          ['banner login # <text> #', 'Message displayed at the login prompt itself'],
          ['no ip domain-lookup', 'Disable DNS lookup on mistyped commands — avoids delays'],
          ['ip domain-name <domain>', 'DNS domain suffix appended to unqualified hostnames'],
          ['ip name-server <ip>', 'DNS server for router-initiated name resolution'],
        ]},
        { label: 'Enable & Password Security', col: '#bb44cc', cmds: [
          ['enable secret <pw>', 'Hashed enable password — type 5 (MD5) by default'],
          ['enable algorithm-type sha256 secret <pw>', 'Type 8 — PBKDF2-SHA256, stronger'],
          ['enable algorithm-type scrypt secret <pw>', 'Type 9 — scrypt, strongest, preferred'],
          ['enable password <pw>', 'Plaintext password — never use, prefer secret'],
          ['service password-encryption', 'Obfuscate all plaintext passwords with type-7'],
          ['security passwords min-length <n>', 'Enforce minimum length for all passwords'],
          ['login block-for <s> attempts <n> within <s>', 'Auto-block after N failed logins'],
        ]},
        { label: 'Local Users & AAA', col: '#bb44cc', cmds: [
          ['username <n> privilege 15 secret <pw>', 'Local user with full privilege'],
          ['username <n> privilege <0-15> secret <pw>', 'Local user with specific privilege level'],
          ['aaa new-model', 'Enable AAA framework — must be first'],
          ['aaa authentication login default local', 'Use local DB as default login auth'],
          ['aaa authentication login default group tacacs+ local', 'TACACS+ with local fallback'],
          ['aaa authentication login default group radius local', 'RADIUS with local fallback'],
          ['aaa authorization exec default local', 'Authorize exec sessions locally'],
          ['tacacs server <name>', 'Define TACACS+ server (modern IOS syntax)'],
          ['radius server <name>', 'Define RADIUS server (modern IOS syntax)'],
        ]},
        { label: 'SSH', col: '#bb44cc', cmds: [
          ['crypto key generate rsa modulus 2048', 'Generate RSA keypair — required for SSH'],
          ['crypto key zeroize rsa', 'Delete RSA keys'],
          ['ip ssh version 2', 'Enforce SSHv2 only — never allow v1'],
          ['ip ssh time-out <sec>', 'SSH negotiation timeout'],
          ['ip ssh authentication-retries <n>', 'Max failed SSH attempts before disconnect'],
        ]},
        { label: 'Static Routing', col: '#bb44cc', cmds: [
          ['ip route <net> <mask> <next-hop>', 'Static route via next-hop IP'],
          ['ip route <net> <mask> <interface>', 'Static route via exit interface'],
          ['ip route <net> <mask> <next-hop> <AD>', 'Static route with custom admin distance'],
          ['ip route 0.0.0.0 0.0.0.0 <next-hop>', 'Default route — gateway of last resort'],
          ['ipv6 unicast-routing', 'Enable IPv6 routing globally — required'],
          ['ipv6 route ::/0 <next-hop>', 'IPv6 default route'],
        ]},
        { label: 'NAT / PAT', col: '#bb44cc', cmds: [
          ['ip nat inside source static <local> <global>', 'Static NAT — one-to-one permanent mapping'],
          ['ip nat inside source list <acl> interface <int> overload', 'PAT — many-to-one (most common)'],
          ['ip nat pool <n> <start> <end> netmask <mask>', 'Define a pool of public IPs'],
          ['ip nat inside source list <acl> pool <n>', 'Dynamic NAT using a pool'],
          ['ip nat inside source list <acl> pool <n> overload', 'PAT using a named pool'],
        ]},
        { label: 'DHCP', col: '#bb44cc', cmds: [
          ['ip dhcp excluded-address <start> <end>', 'Reserve IPs — will not be assigned to clients'],
          ['ip dhcp pool <name>', 'Create DHCP pool and enter dhcp-config mode'],
          ['no ip dhcp pool <name>', 'Delete DHCP pool'],
          ['no service dhcp', 'Disable DHCP server and relay globally'],
        ]},
        { label: 'NTP', col: '#bb44cc', cmds: [
          ['ntp server <ip>', 'Sync from this NTP server (client mode)'],
          ['ntp server <ip> prefer', 'Prefer this server over other configured servers'],
          ['ntp master <stratum>', 'Act as NTP master — use stratum 8+ without external source'],
          ['ntp authenticate', 'Enable NTP authentication'],
          ['ntp authentication-key <id> md5 <key>', 'Define NTP auth key'],
          ['ntp trusted-key <id>', 'Trust this key for authentication'],
          ['ntp update-calendar', 'Sync hardware calendar from software clock'],
        ]},
        { label: 'Logging / Syslog', col: '#bb44cc', cmds: [
          ['logging console <level>', 'Log to console — 0=emergency → 7=debug'],
          ['logging buffered <size> <level>', 'Log to RAM buffer'],
          ['logging host <ip>', 'Send syslog to external server'],
          ['logging trap <level>', 'Level sent to syslog server'],
          ['service timestamps log datetime msec', 'Add date/time/ms to log entries'],
          ['service timestamps debug datetime msec', 'Add timestamps to debug output'],
        ]},
        { label: 'CDP / LLDP', col: '#bb44cc', cmds: [
          ['no cdp run', 'Disable CDP globally'],
          ['cdp timer <sec>', 'CDP advertisement interval (default 60s)'],
          ['cdp holdtime <sec>', 'How long to retain neighbor info (default 180s)'],
          ['lldp run', 'Enable LLDP globally (off by default on routers)'],
          ['no lldp run', 'Disable LLDP globally'],
        ]},
        { label: 'Navigate to Sub-modes', col: '#bb44cc', cmds: [
          ['interface <type> <num>', 'Interface config — e.g. interface GigabitEthernet0/0'],
          ['interface <type> <num>.<sub>', 'Subinterface — e.g. interface Gi0/0.10'],
          ['line console 0', 'Console line config'],
          ['line vty 0 15', 'VTY lines 0–15 (remote access)'],
          ['line aux 0', 'AUX port (out-of-band modem access)'],
          ['router ospf <pid>', 'OSPF routing process config'],
          ['router eigrp <asn>', 'EIGRP routing process config'],
          ['router rip', 'RIP routing config'],
          ['router bgp <asn>', 'BGP routing config'],
          ['ip dhcp pool <n>', 'DHCP pool config'],
          ['ip access-list standard <n>', 'Standard named ACL config'],
          ['ip access-list extended <n>', 'Extended named ACL config'],
          ['end', 'Return directly to Privileged EXEC from anywhere'],
          ['exit', 'Return one level up'],
          ['Ctrl+Z', 'Same as end'],
        ]},
      ]
    },
    {
      id: 'interface', name: 'Interface', prompt: 'Router(config-if)#', col: '#22aabb',
      desc: 'Configure a specific physical or logical interface. All settings apply only to the selected interface.',
      enter: 'Router(config)# interface GigabitEthernet0/0',
      groups: [
        { label: 'IP Addressing', col: '#22aabb', cmds: [
          ['ip address <ip> <mask>', 'Assign static IPv4 address'],
          ['ip address <ip> <mask> secondary', 'Add secondary IP on same interface'],
          ['ip address dhcp', 'Obtain IP via DHCP — router as DHCP client'],
          ['ipv6 address <ipv6/prefix>', 'Assign static IPv6 global unicast address'],
          ['ipv6 address <addr> link-local', 'Manually set link-local IPv6 address'],
          ['ipv6 address autoconfig', 'SLAAC — auto-configure from RA prefix'],
          ['ipv6 enable', 'Enable IPv6 — link-local only, no GUA assigned'],
          ['no ip address', 'Remove configured IP address'],
        ]},
        { label: 'Interface Control', col: '#22aabb', cmds: [
          ['no shutdown', 'Enable (bring up) the interface'],
          ['shutdown', 'Administratively disable the interface'],
          ['description <text>', 'Label for documentation'],
          ['bandwidth <kbps>', 'Reference bandwidth — used by routing protocol metrics'],
          ['delay <tens-of-usec>', 'Delay — used in EIGRP composite metric'],
          ['mtu <bytes>', 'Maximum Transmission Unit (default 1500)'],
          ['duplex <full|half|auto>', 'Set duplex mode'],
          ['speed <10|100|1000|auto>', 'Set port speed'],
        ]},
        { label: 'NAT', col: '#22aabb', cmds: [
          ['ip nat inside', 'Mark as inside (LAN-facing) for NAT'],
          ['ip nat outside', 'Mark as outside (WAN-facing) for NAT'],
        ]},
        { label: 'ACL Application', col: '#22aabb', cmds: [
          ['ip access-group <acl> in', 'Apply ACL to filter inbound traffic'],
          ['ip access-group <acl> out', 'Apply ACL to filter outbound traffic'],
          ['ipv6 traffic-filter <acl> in', 'Apply IPv6 ACL inbound'],
        ]},
        { label: 'DHCP Relay', col: '#22aabb', cmds: [
          ['ip helper-address <server-ip>', 'Forward DHCP broadcasts to remote server'],
        ]},
        { label: 'OSPF (interface-level)', col: '#22aabb', cmds: [
          ['ip ospf <pid> area <area>', 'Enable OSPF directly on this interface (modern method)'],
          ['ip ospf cost <1-65535>', 'Override auto-calculated OSPF cost'],
          ['ip ospf priority <0-255>', 'Influence DR/BDR election — 0 means never DR'],
          ['ip ospf hello-interval <sec>', 'Hello timer — must match neighbor'],
          ['ip ospf dead-interval <sec>', 'Dead timer — must match neighbor (default 4x hello)'],
          ['ip ospf network point-to-point', 'No DR/BDR election on this link'],
          ['ip ospf network broadcast', 'Force broadcast type (default on Ethernet)'],
          ['ip ospf authentication message-digest', 'Enable MD5 auth on this interface'],
          ['ip ospf message-digest-key <key-id> md5 <key>', 'Set MD5 key for OSPF auth'],
        ]},
        { label: 'HSRP — First Hop Redundancy', col: '#22aabb', cmds: [
          ['standby <group> ip <virtual-ip>', 'Define HSRP virtual gateway IP'],
          ['standby <group> priority <0-255>', 'Priority — highest becomes active (default 100)'],
          ['standby <group> preempt', 'Preempt current active when priority is highest'],
          ['standby <group> timers <hello> <hold>', 'HSRP hello and hold timers'],
          ['standby version 2', 'Use HSRPv2 (supports IPv6, more groups)'],
        ]},
        { label: 'CDP / LLDP per Interface', col: '#22aabb', cmds: [
          ['no cdp enable', 'Disable CDP on this interface only'],
          ['no lldp transmit', 'Stop sending LLDP frames'],
          ['no lldp receive', 'Stop processing received LLDP frames'],
        ]},
      ]
    },
    {
      id: 'subif', name: 'Subinterface', prompt: 'Router(config-subif)#', col: '#22aabb',
      desc: "Router-on-a-Stick inter-VLAN routing. Each subinterface handles one VLAN. Parent interface needs no IP, just 'no shutdown'.",
      enter: 'Router(config)# interface GigabitEthernet0/0.10',
      groups: [
        { label: 'Core Configuration', col: '#22aabb', cmds: [
          ['encapsulation dot1q <vlan-id>', '802.1Q VLAN tagging — mandatory'],
          ['encapsulation dot1q <vlan-id> native', 'Mark as native VLAN — traffic arrives untagged'],
          ['ip address <ip> <mask>', 'Assign IP — this is the default gateway for the VLAN'],
          ['ipv6 address <ipv6/prefix>', 'IPv6 address for this VLAN segment'],
          ['no shutdown', 'Enable the subinterface'],
          ['description <text>', 'Label — e.g. "VLAN10 - Sales"'],
          ['ip access-group <acl> in', 'Apply ACL to inbound VLAN traffic'],
          ['ip helper-address <ip>', 'DHCP relay for clients in this VLAN'],
        ]},
      ]
    },
    {
      id: 'line', name: 'Line (con / vty / aux)', prompt: 'Router(config-line)#', col: '#dd5544',
      desc: 'Configure console (physical), VTY (remote SSH/Telnet 0–15), or AUX (out-of-band modem) access lines.',
      enter: 'Router(config)# line console 0\nRouter(config)# line vty 0 15\nRouter(config)# line aux 0',
      groups: [
        { label: 'Authentication', col: '#dd5544', cmds: [
          ['password <pw>', 'Set line password (used with login, not login local)'],
          ['login', 'Require line password for access'],
          ['login local', 'Authenticate against local username DB'],
          ['login authentication <list>', 'Use named AAA authentication list'],
          ['no login', 'No authentication — console/lab only'],
        ]},
        { label: 'Session Control', col: '#dd5544', cmds: [
          ['exec-timeout <min> <sec>', 'Idle timeout before auto-disconnect — 0 0 = never'],
          ['logging synchronous', 'Prevent syslog from breaking typed commands'],
          ['history size <n>', 'Command history buffer size'],
          ['length <lines>', 'Terminal height (0 = disable pagination)'],
          ['privilege level <0-15>', 'Default privilege granted on this line'],
        ]},
        { label: 'VTY-specific', col: '#dd5544', cmds: [
          ['transport input ssh', 'Allow SSH only — best practice'],
          ['transport input telnet', 'Allow Telnet only — insecure, avoid'],
          ['transport input telnet ssh', 'Allow both Telnet and SSH'],
          ['transport input none', 'Disable all remote access'],
          ['transport output ssh', 'Use SSH for outbound connections from router'],
          ['access-class <acl> in', 'Restrict which source IPs can connect to VTY'],
          ['ipv6 access-class <acl> in', 'IPv6 ACL to restrict management access'],
        ]},
      ]
    },
    {
      id: 'ospf', name: 'Router OSPF', prompt: 'Router(config-router)#', col: '#cc3399',
      desc: 'OSPF routing process. Link-state, uses SPF algorithm, hierarchical areas. Multiple processes can coexist.',
      enter: 'Router(config)# router ospf <process-id>',
      groups: [
        { label: 'Core', col: '#cc3399', cmds: [
          ['network <ip> <wildcard> area <area>', 'Advertise interfaces matching range into OSPF'],
          ['router-id <ip>', 'Manually set router ID — overrides automatic selection'],
          ['passive-interface <int>', 'Suppress hellos on interface (network still advertised)'],
          ['passive-interface default', 'All interfaces passive — re-enable individually'],
          ['no passive-interface <int>', 'Re-enable hellos on specific interface'],
          ['auto-cost reference-bandwidth <mbps>', 'Calibrate cost formula — set 1000 or 10000 for fast links'],
          ['default-information originate', 'Inject default route into OSPF'],
          ['default-information originate always', 'Inject default even without local default route'],
          ['distance ospf intra-area <d> inter-area <d> external <d>', 'Modify OSPF admin distances'],
        ]},
        { label: 'Area Types', col: '#cc3399', cmds: [
          ['area <id> stub', 'Stub area — no external LSAs from ASBR'],
          ['area <id> stub no-summary', 'Totally stubby — only default route from ABR'],
          ['area <id> nssa', 'NSSA — allows ASBR inside stub-like area'],
          ['area <id> nssa no-summary', 'Totally NSSA'],
          ['area <id> virtual-link <router-id>', 'Connect discontiguous backbone through transit area'],
        ]},
        { label: 'Redistribution', col: '#cc3399', cmds: [
          ['redistribute eigrp <asn> subnets', 'Import EIGRP routes into OSPF'],
          ['redistribute bgp <asn> subnets', 'Import BGP routes'],
          ['redistribute static subnets', 'Import static routes'],
          ['redistribute connected subnets', 'Import directly connected networks'],
          ['redistribute rip subnets', 'Import RIP routes'],
        ]},
        { label: 'Summarization', col: '#cc3399', cmds: [
          ['area <id> range <ip> <mask>', 'Summarize at ABR — intra-area to inter-area'],
          ['summary-address <ip> <mask>', 'Summarize redistributed external routes at ASBR'],
        ]},
      ]
    },
    {
      id: 'eigrp', name: 'Router EIGRP', prompt: 'Router(config-router)#', col: '#cc3399',
      desc: 'EIGRP — advanced distance-vector using DUAL algorithm. Fast convergence, composite metric. Cisco proprietary (now RFC 7868).',
      enter: 'Router(config)# router eigrp <AS-number>',
      groups: [
        { label: 'Core', col: '#cc3399', cmds: [
          ['network <ip>', 'Advertise classful network'],
          ['network <ip> <wildcard>', 'Advertise network with wildcard precision'],
          ['no auto-summary', 'Disable classful auto-summarization — always recommended'],
          ['eigrp router-id <ip>', 'Manually set EIGRP router ID'],
          ['passive-interface <int>', 'No hellos or updates on this interface'],
          ['passive-interface default', 'All interfaces passive by default'],
          ['variance <multiplier>', 'Unequal-cost load balancing — multiplier × best metric'],
          ['maximum-paths <n>', 'Max equal-cost paths to install (default 4)'],
          ['bandwidth-percent eigrp <asn> <pct>', 'Limit % of bandwidth EIGRP may use'],
        ]},
        { label: 'Redistribution', col: '#cc3399', cmds: [
          ['redistribute ospf <pid> metric <bw> <dly> <rel> <load> <mtu>', 'Import OSPF into EIGRP with seed metric'],
          ['redistribute static', 'Import static routes'],
          ['redistribute connected', 'Import directly connected networks'],
          ['default-metric <bw> <dly> <rel> <load> <mtu>', 'Default seed metric for all redistribution'],
        ]},
      ]
    },
    {
      id: 'rip', name: 'Router RIP', prompt: 'Router(config-router)#', col: '#cc3399',
      desc: 'RIP — legacy distance-vector. Max 15 hops. Use RIPv2 for classless support. Not recommended for production.',
      enter: 'Router(config)# router rip',
      groups: [
        { label: 'Core', col: '#cc3399', cmds: [
          ['version 2', 'Use RIPv2 — classless, supports VLSM, multicast updates'],
          ['network <ip>', 'Advertise classful network'],
          ['no auto-summary', 'Disable classful auto-summarization'],
          ['passive-interface <int>', 'No RIP updates sent on this interface'],
          ['default-information originate', 'Advertise default route via RIP'],
          ['timers basic <update> <invalid> <holddown> <flush>', 'Adjust RIP timers'],
        ]},
      ]
    },
    {
      id: 'bgp', name: 'Router BGP', prompt: 'Router(config-router)#', col: '#cc3399',
      desc: 'BGP — path-vector protocol. eBGP between ASes (internet), iBGP within an AS. Highly scalable but complex.',
      enter: 'Router(config)# router bgp <AS-number>',
      groups: [
        { label: 'Core', col: '#cc3399', cmds: [
          ['neighbor <ip> remote-as <asn>', 'Define BGP peer — eBGP if different ASN'],
          ['network <ip> mask <mask>', 'Advertise prefix into BGP (must exist in routing table)'],
          ['bgp router-id <ip>', 'Manually set BGP router ID'],
          ['no auto-summary', 'Disable auto-summarization'],
          ['no synchronization', 'Disable BGP/IGP sync (required in modern IOS)'],
        ]},
        { label: 'iBGP / eBGP Tuning', col: '#cc3399', cmds: [
          ['neighbor <ip> update-source loopback0', 'Use loopback as TCP source — iBGP best practice'],
          ['neighbor <ip> next-hop-self', 'Override next-hop for iBGP peers'],
          ['neighbor <ip> ebgp-multihop <n>', 'Allow eBGP over multiple hops'],
          ['neighbor <ip> description <text>', 'Label BGP peer for documentation'],
          ['neighbor <ip> shutdown', 'Administratively disable a BGP peer'],
          ['neighbor <ip> route-map <n> in', 'Apply route-map to inbound BGP updates'],
          ['neighbor <ip> route-map <n> out', 'Apply route-map to outbound BGP updates'],
        ]},
      ]
    },
    {
      id: 'dhcp', name: 'DHCP Pool', prompt: 'Router(dhcp-config)#', col: '#3399cc',
      desc: 'Configure a DHCP address pool. The router acts as DHCP server for clients on the specified network.',
      enter: 'Router(config)# ip dhcp pool <pool-name>',
      groups: [
        { label: 'Pool Configuration', col: '#3399cc', cmds: [
          ['network <ip> <mask>', 'Network range to assign addresses from'],
          ['default-router <ip>', 'Default gateway sent to clients'],
          ['dns-server <ip1> [ip2]', 'DNS servers sent to clients'],
          ['domain-name <domain>', 'Domain name sent to clients'],
          ['lease <days> [hours] [mins]', 'Lease duration — 0 0 0 = infinite'],
          ['lease infinite', 'Set infinite lease'],
          ['host <ip> <mask>', 'Define pool for a single static binding'],
          ['client-identifier <mac>', 'Match client by MAC for static assignment'],
          ['netbios-name-server <ip>', 'WINS server (legacy Windows)'],
        ]},
      ]
    },
    {
      id: 'acl', name: 'Named ACL', prompt: 'Router(config-std/ext-nacl)#', col: '#ccaa22',
      desc: 'Named ACL mode. Edit individual ACEs by sequence number without rewriting the full list.',
      enter: 'Router(config)# ip access-list extended <name>\nRouter(config)# ip access-list standard <name>',
      groups: [
        { label: 'Standard ACL — match source IP only', col: '#ccaa22', cmds: [
          ['permit <source> <wildcard>', 'Allow traffic from source'],
          ['deny <source> <wildcard>', 'Block traffic from source'],
          ['permit host <ip>', 'Allow single host — equivalent to /32 wildcard'],
          ['deny host <ip>', 'Block single host'],
          ['permit any', 'Allow all sources'],
          ['deny any', 'Block all (implicit at end — already there)'],
          ['<seq> permit <source> <wildcard>', 'Insert ACE at specific sequence number'],
          ['no <sequence-number>', 'Delete ACE by its sequence number'],
        ]},
        { label: 'Extended ACL — src, dst, protocol, port', col: '#ccaa22', cmds: [
          ['permit tcp <src> <wc> <dst> <wc> eq <port>', 'Permit TCP to specific destination port'],
          ['permit tcp <src> <wc> <dst> <wc> range <lo> <hi>', 'Permit TCP destination port range'],
          ['permit udp <src> <wc> <dst> <wc> eq <port>', 'Permit UDP to specific destination port'],
          ['permit icmp <src> <wc> <dst> <wc>', 'Permit ICMP (ping)'],
          ['permit ip any any', 'Permit all IP traffic'],
          ['deny ip any any log', 'Deny all and log matches — explicit deny for logging'],
          ['permit tcp any any established', 'Allow return TCP traffic (stateless ACL trick)'],
          ['remark <text>', 'Add a comment line in the ACL'],
        ]},
      ]
    },
  ]
}

const SWITCH: DeviceData = {
  label: 'Switch',
  acc: '#00dd99',
  flow: [
    { id: 'user', label: 'User EXEC', prompt: 'Switch>' },
    { id: 'enable', label: 'Privileged EXEC', prompt: 'Switch#' },
    {
      id: 'config', label: 'Global Config', prompt: 'Switch(config)#',
      branches: [
        { id: 'interface', label: 'Interface (config-if)' },
        { id: 'vlan', label: 'VLAN (config-vlan)' },
        { id: 'svi', label: 'SVI / VLAN Interface (config-if)' },
        { id: 'line', label: 'Line con/vty (config-line)' },
        { id: 'acl', label: 'Named ACL (config-std/ext-nacl)' },
      ]
    }
  ],
  modes: [
    {
      id: 'user', name: 'User EXEC', prompt: 'Switch>', col: '#4488dd',
      desc: 'Entry point after login. Very restricted — read-only, no configuration.',
      enter: 'Default mode on console/SSH/Telnet login',
      groups: [
        { label: 'Navigation', col: '#4488dd', cmds: [
          ['enable', 'Enter Privileged EXEC mode'],
          ['logout / exit', 'End the session'],
        ]},
        { label: 'Basic Diagnostics', col: '#4488dd', cmds: [
          ['ping <ip>', 'Test basic reachability (uses management IP)'],
          ['traceroute <ip>', 'Trace path to destination'],
          ['show version', 'IOS version, uptime, hardware model'],
          ['show clock', 'Current date and time'],
        ]},
      ]
    },
    {
      id: 'enable', name: 'Privileged EXEC', prompt: 'Switch#', col: '#dd8822',
      desc: 'Full read access. All show commands and file operations. Entry point to configuration mode.',
      enter: 'Switch> enable',
      groups: [
        { label: 'Mode Navigation', col: '#dd8822', cmds: [
          ['configure terminal', 'Enter Global Configuration mode'],
          ['disable', 'Return to User EXEC'],
          ['exit / logout', 'End the session'],
        ]},
        { label: 'Show — System', col: '#dd8822', cmds: [
          ['show running-config', 'Active config in RAM'],
          ['show startup-config', 'Config saved in NVRAM'],
          ['show version', 'IOS, uptime, hardware, flash'],
          ['show clock', 'System time'],
          ['show users', 'Logged-in users and their lines'],
          ['show history', 'Recent command history'],
          ['show ip interface brief', 'Interface IP, status, protocol summary'],
          ['show interfaces', 'Full counters for all interfaces'],
          ['show interfaces <int>', 'Detail for one interface'],
          ['show interfaces status', 'Port status, VLAN, speed, duplex — switch-specific'],
        ]},
        { label: 'Show — VLANs & Trunking', col: '#dd8822', cmds: [
          ['show vlan', 'All VLANs and their member ports'],
          ['show vlan brief', 'Compact VLAN list'],
          ['show vlan id <id>', 'Detail for one VLAN'],
          ['show interfaces trunk', 'All trunk ports — allowed, active, native VLANs'],
          ['show interfaces <int> switchport', 'Full switchport config — mode, VLANs, DTP state'],
          ['show interfaces <int> trunk', 'Trunk detail for one port'],
          ['show vtp status', 'VTP mode, domain, revision, VLAN count'],
          ['show vtp counters', 'VTP advertisement counters'],
        ]},
        { label: 'Show — MAC / CAM Table', col: '#dd8822', cmds: [
          ['show mac address-table', 'Full MAC address table'],
          ['show mac address-table dynamic', 'Dynamically learned entries only'],
          ['show mac address-table interface <int>', 'MACs learned on a specific port'],
          ['show mac address-table vlan <id>', 'MACs within a specific VLAN'],
          ['show mac address-table count', 'Total entries per VLAN and overall'],
          ['clear mac address-table dynamic', 'Flush all dynamic MAC entries'],
        ]},
        { label: 'Show — Spanning Tree', col: '#dd8822', cmds: [
          ['show spanning-tree', 'STP topology for all VLANs'],
          ['show spanning-tree vlan <id>', 'STP detail for one VLAN — root, ports, states'],
          ['show spanning-tree summary', 'STP mode, counts of forwarding/blocking ports'],
          ['show spanning-tree interface <int>', 'STP state and detail for one port'],
          ['show spanning-tree blockedports', 'All currently blocked ports'],
        ]},
        { label: 'Show — Security & Snooping', col: '#dd8822', cmds: [
          ['show port-security', 'Port security summary for all ports'],
          ['show port-security interface <int>', 'Port security detail — max, current, violations'],
          ['show port-security address', 'All secure MAC addresses'],
          ['show ip dhcp snooping', 'DHCP snooping config — VLANs, option 82'],
          ['show ip dhcp snooping binding', 'Snooping binding table — IP, MAC, VLAN, port'],
          ['show ip dhcp snooping statistics', 'DHCP snooping counters'],
          ['show ip arp inspection', 'DAI config — trusted/untrusted VLANs'],
          ['show ip arp inspection statistics', 'DAI counters per VLAN'],
        ]},
        { label: 'Show — EtherChannel', col: '#dd8822', cmds: [
          ['show etherchannel summary', 'All EtherChannels — flags, member ports, status'],
          ['show etherchannel <id> detail', 'Detail for one EtherChannel'],
          ['show lacp neighbor', 'LACP negotiation detail with neighbor'],
          ['show pagp neighbor', 'PAgP neighbor detail'],
        ]},
        { label: 'Show — Neighbors', col: '#dd8822', cmds: [
          ['show cdp neighbors', 'Cisco neighbors — device, port, capabilities'],
          ['show cdp neighbors detail', 'Full detail — IP, platform, IOS version'],
          ['show lldp neighbors', 'LLDP neighbor summary'],
          ['show lldp neighbors detail', 'Full LLDP neighbor detail'],
        ]},
        { label: 'File Operations', col: '#dd8822', cmds: [
          ['copy running-config startup-config', 'Save config to NVRAM'],
          ['write erase', 'Erase startup config'],
          ['delete vlan.dat', 'Delete VLAN database — separate from config!'],
          ['dir flash:', 'List flash contents'],
          ['reload', 'Reboot the switch'],
        ]},
      ]
    },
    {
      id: 'config', name: 'Global Config', prompt: 'Switch(config)#', col: '#bb44cc',
      desc: 'Top-level configuration. Affects the entire switch. Entry point to all sub-modes.',
      enter: 'Switch# configure terminal',
      groups: [
        { label: 'Identity & Basics', col: '#bb44cc', cmds: [
          ['hostname <name>', 'Set switch hostname'],
          ['banner motd # <text> #', 'Message displayed before login'],
          ['banner login # <text> #', 'Message displayed at login prompt'],
          ['no ip domain-lookup', 'Disable DNS on mistyped commands'],
        ]},
        { label: 'Enable & Password Security', col: '#bb44cc', cmds: [
          ['enable secret <pw>', 'Hashed enable password — type 5 by default'],
          ['enable algorithm-type sha256 secret <pw>', 'Type 8 — stronger hash'],
          ['enable algorithm-type scrypt secret <pw>', 'Type 9 — strongest'],
          ['service password-encryption', 'Obfuscate plaintext passwords with type-7'],
          ['security passwords min-length <n>', 'Enforce minimum password length'],
        ]},
        { label: 'Local Users & AAA', col: '#bb44cc', cmds: [
          ['username <n> privilege 15 secret <pw>', 'Full-privilege local user'],
          ['aaa new-model', 'Enable AAA — required first'],
          ['aaa authentication login default local', 'Local DB as default auth'],
          ['aaa authentication login default group tacacs+ local', 'TACACS+ with fallback'],
          ['aaa authentication login default group radius local', 'RADIUS with fallback'],
        ]},
        { label: 'SSH', col: '#bb44cc', cmds: [
          ['crypto key generate rsa modulus 2048', 'Generate RSA keypair for SSH'],
          ['ip ssh version 2', 'Enforce SSHv2'],
          ['ip ssh time-out <sec>', 'SSH negotiation timeout'],
          ['ip ssh authentication-retries <n>', 'Max SSH login failures'],
          ['ip domain-name <domain>', 'Required before generating RSA key'],
        ]},
        { label: 'VTP', col: '#bb44cc', cmds: [
          ['vtp mode server', 'Can create/modify/delete VLANs and propagate'],
          ['vtp mode client', 'Receives VLANs — cannot create or modify locally'],
          ['vtp mode transparent', 'Ignores VTP — manages own VLANs locally'],
          ['vtp mode off', 'Completely disable VTP (VTPv3 only)'],
          ['vtp domain <name>', 'Set VTP domain name — must match to exchange info'],
          ['vtp password <pw>', 'Authenticate VTP messages'],
          ['vtp version 3', 'Use VTPv3 — supports extended VLANs and MST'],
        ]},
        { label: 'Spanning Tree — Global', col: '#bb44cc', cmds: [
          ['spanning-tree mode pvst', 'Per-VLAN STP — classic 802.1D based'],
          ['spanning-tree mode rapid-pvst', 'Rapid Per-VLAN STP — recommended'],
          ['spanning-tree mode mst', 'MSTP 802.1s — multiple instances'],
          ['spanning-tree vlan <id> priority <val>', 'Bridge priority — multiples of 4096, default 32768'],
          ['spanning-tree vlan <id> root primary', 'Set as root bridge for this VLAN'],
          ['spanning-tree vlan <id> root secondary', 'Set as backup root bridge'],
          ['spanning-tree portfast default', 'PortFast on all access ports by default'],
          ['spanning-tree portfast bpduguard default', 'BPDUGuard on all PortFast ports globally'],
        ]},
        { label: 'DHCP Snooping', col: '#bb44cc', cmds: [
          ['ip dhcp snooping', 'Enable DHCP snooping globally'],
          ['ip dhcp snooping vlan <id>', 'Enable snooping on specific VLANs'],
          ['no ip dhcp snooping information option', 'Disable option 82 insertion (on access switches)'],
        ]},
        { label: 'Dynamic ARP Inspection', col: '#bb44cc', cmds: [
          ['ip arp inspection vlan <id>', 'Enable DAI on VLAN — requires DHCP snooping'],
          ['ip arp inspection validate src-mac dst-mac ip', 'Additional ARP validation checks'],
        ]},
        { label: 'Layer 3 Routing (L3 Switch)', col: '#bb44cc', cmds: [
          ['ip routing', 'Enable Layer 3 routing between SVIs'],
          ['ip route 0.0.0.0 0.0.0.0 <next-hop>', 'Default route (L3 switch)'],
          ['router ospf <pid>', 'Enable OSPF on L3 switch'],
          ['ipv6 unicast-routing', 'Enable IPv6 routing on L3 switch'],
        ]},
        { label: 'Management IP (L2 Switch)', col: '#bb44cc', cmds: [
          ['ip default-gateway <ip>', 'Default gateway — only when ip routing is OFF'],
        ]},
        { label: 'NTP / Logging', col: '#bb44cc', cmds: [
          ['ntp server <ip>', 'Sync time from NTP server'],
          ['ntp master <stratum>', 'Act as NTP master'],
          ['logging host <ip>', 'Send syslogs to external server'],
          ['logging buffered <level>', 'Log to RAM buffer'],
          ['service timestamps log datetime msec', 'Timestamps on log entries'],
        ]},
        { label: 'CDP / LLDP', col: '#bb44cc', cmds: [
          ['no cdp run', 'Disable CDP globally'],
          ['lldp run', 'Enable LLDP globally'],
          ['no lldp run', 'Disable LLDP globally'],
        ]},
        { label: 'Navigate to Sub-modes', col: '#bb44cc', cmds: [
          ['interface <type> <num>', 'Enter interface config — e.g. interface Fa0/1'],
          ['interface range <type> <start> - <end>', 'Configure multiple ports at once'],
          ['vlan <id>', 'Enter VLAN config mode — creates VLAN if new'],
          ['interface vlan <id>', 'Enter SVI config mode'],
          ['line console 0', 'Console line config'],
          ['line vty 0 15', 'VTY remote access lines'],
          ['ip access-list extended <n>', 'Extended named ACL config'],
          ['ip access-list standard <n>', 'Standard named ACL config'],
          ['end', 'Return directly to Privileged EXEC'],
          ['exit', 'Return one level up'],
        ]},
      ]
    },
    {
      id: 'interface', name: 'Interface', prompt: 'Switch(config-if)#', col: '#22aabb',
      desc: 'Configure a specific physical switch port. Access mode, trunk mode, port security, STP settings, EtherChannel.',
      enter: 'Switch(config)# interface FastEthernet0/1\nSwitch(config)# interface range Fa0/1 - 24',
      groups: [
        { label: 'Access Port', col: '#22aabb', cmds: [
          ['switchport mode access', 'Set as access port — carries single VLAN untagged'],
          ['switchport access vlan <id>', 'Assign port to this VLAN (default is VLAN 1)'],
          ['switchport voice vlan <id>', 'Assign separate voice VLAN — for IP phones'],
          ['no shutdown', 'Enable the port'],
          ['shutdown', 'Disable the port'],
          ['description <text>', 'Document what is connected to this port'],
        ]},
        { label: 'Trunk Port', col: '#22aabb', cmds: [
          ['switchport mode trunk', 'Set as 802.1Q trunk — carries multiple VLANs tagged'],
          ['switchport trunk encapsulation dot1q', 'Set 802.1Q encapsulation (required on older IOS)'],
          ['switchport trunk native vlan <id>', 'Set native VLAN — frames on this VLAN are untagged'],
          ['switchport trunk allowed vlan <ids>', 'Restrict VLANs — e.g. 10,20,30 or 10-50'],
          ['switchport trunk allowed vlan add <id>', 'Add VLAN to allowed list'],
          ['switchport trunk allowed vlan remove <id>', 'Remove VLAN from trunk'],
          ['switchport trunk allowed vlan all', 'Allow all VLANs (default)'],
          ['switchport nonegotiate', 'Disable DTP — prevents unauthorized trunk formation'],
        ]},
        { label: 'DTP (Dynamic Trunking)', col: '#22aabb', cmds: [
          ['switchport mode dynamic desirable', 'Actively tries to form a trunk with neighbor'],
          ['switchport mode dynamic auto', 'Passively waits — forms trunk if neighbor initiates'],
        ]},
        { label: 'Port Security', col: '#22aabb', cmds: [
          ['switchport port-security', 'Enable port security (must be access mode first)'],
          ['switchport port-security maximum <n>', 'Max allowed MAC addresses on this port'],
          ['switchport port-security mac-address <mac>', 'Statically define an allowed MAC'],
          ['switchport port-security mac-address sticky', 'Dynamically learn and save MACs to config'],
          ['switchport port-security violation shutdown', 'Err-disable port on violation (default)'],
          ['switchport port-security violation restrict', 'Drop frames and log — port stays up'],
          ['switchport port-security violation protect', 'Drop frames silently — no logging'],
        ]},
        { label: 'Spanning Tree — Interface', col: '#22aabb', cmds: [
          ['spanning-tree portfast', 'Skip STP listen/learn — for end-device ports only'],
          ['spanning-tree bpduguard enable', 'Err-disable port if BPDU received — security'],
          ['spanning-tree bpdufilter enable', 'Drop BPDUs on this port — use with care'],
          ['spanning-tree guard root', 'Prevent this port from becoming root port'],
          ['spanning-tree guard loop', 'Protect against unidirectional link failure'],
          ['spanning-tree cost <value>', 'Override STP port cost manually'],
          ['spanning-tree port-priority <0-240>', 'Influence port role — multiples of 16'],
        ]},
        { label: 'EtherChannel', col: '#22aabb', cmds: [
          ['channel-group <id> mode active', 'Join bundle — LACP active (initiates negotiation)'],
          ['channel-group <id> mode passive', 'Join bundle — LACP passive (waits)'],
          ['channel-group <id> mode desirable', 'Join bundle — PAgP desirable'],
          ['channel-group <id> mode auto', 'Join bundle — PAgP auto'],
          ['channel-group <id> mode on', 'Static bundle — no negotiation protocol'],
        ]},
        { label: 'DHCP Snooping / DAI per Port', col: '#22aabb', cmds: [
          ['ip dhcp snooping trust', 'Trust port — for uplinks, servers, other switches'],
          ['ip dhcp snooping limit rate <pps>', 'Rate-limit DHCP packets on this port'],
          ['ip arp inspection trust', 'Trust port for ARP inspection — uplinks only'],
        ]},
        { label: 'Storm Control', col: '#22aabb', cmds: [
          ['storm-control broadcast level <pct>', 'Threshold for broadcast storm suppression'],
          ['storm-control multicast level <pct>', 'Threshold for multicast storm suppression'],
          ['storm-control unicast level <pct>', 'Threshold for unknown unicast flood'],
          ['storm-control action shutdown', 'Err-disable port when threshold exceeded'],
          ['storm-control action trap', 'Send SNMP trap when threshold exceeded'],
        ]},
        { label: 'CDP / LLDP per Port', col: '#22aabb', cmds: [
          ['no cdp enable', 'Disable CDP on this port — best practice facing end users'],
          ['no lldp transmit', 'Stop LLDP transmit on this port'],
          ['no lldp receive', 'Stop LLDP receive on this port'],
        ]},
        { label: 'Layer 3 Port (L3 Switch only)', col: '#22aabb', cmds: [
          ['no switchport', 'Convert to routed Layer 3 port — removes VLAN membership'],
          ['ip address <ip> <mask>', 'Assign IP to routed port'],
          ['no shutdown', 'Enable routed port'],
        ]},
        { label: 'Recovery', col: '#22aabb', cmds: [
          ['shutdown', 'Begin port recovery from err-disabled state'],
          ['no shutdown', 'Complete recovery — brings port back up'],
        ]},
      ]
    },
    {
      id: 'vlan', name: 'VLAN', prompt: 'Switch(config-vlan)#', col: '#22bb88',
      desc: 'Create and name VLANs. VLAN membership is assigned per-port in interface mode. VLANs stored in vlan.dat.',
      enter: 'Switch(config)# vlan <1-4094>',
      groups: [
        { label: 'VLAN Configuration', col: '#22bb88', cmds: [
          ['name <name>', 'Assign a descriptive name to this VLAN'],
          ['state active', 'VLAN is active — traffic forwarded (default)'],
          ['state suspend', 'VLAN suspended — traffic blocked'],
          ['exit', 'Return to global config — saves the VLAN'],
        ]},
        { label: 'From Global Config (not in vlan mode)', col: '#22bb88', cmds: [
          ['vlan <id>', 'Create VLAN and enter vlan mode'],
          ['no vlan <id>', 'Delete VLAN — remove from vlan.dat'],
          ['vlan <start>-<end>', 'Create a range of VLANs'],
        ]},
      ]
    },
    {
      id: 'svi', name: 'SVI (VLAN Interface)', prompt: 'Switch(config-if)#', col: '#44bb77',
      desc: 'Switched Virtual Interface — Layer 3 logical interface for a VLAN. Used for management IP or inter-VLAN routing.',
      enter: 'Switch(config)# interface vlan <id>',
      groups: [
        { label: 'Configuration', col: '#44bb77', cmds: [
          ['ip address <ip> <mask>', 'Assign IP — management address or gateway for VLAN'],
          ['ipv6 address <ipv6/prefix>', 'Assign IPv6 address to SVI'],
          ['no shutdown', 'Enable the SVI — must be explicit'],
          ['description <text>', 'Label this SVI'],
          ['ip helper-address <ip>', 'DHCP relay for clients in this VLAN'],
          ['ip access-group <acl> in', 'Apply ACL to inbound SVI traffic (L3 switch)'],
          ['ip access-group <acl> out', 'Apply ACL to outbound SVI traffic'],
          ['ip ospf <pid> area <area>', 'Enable OSPF on SVI (L3 switch)'],
        ]},
        { label: 'Notes', col: '#44bb77', cmds: [
          ['(SVI is UP only if VLAN exists and at least one port is in it and up)', ''],
          ['ip default-gateway (global config)', 'Use instead of SVI gateway when ip routing is OFF'],
        ]},
      ]
    },
    {
      id: 'line', name: 'Line (con / vty)', prompt: 'Switch(config-line)#', col: '#dd5544',
      desc: 'Configure console and VTY access lines for authentication, session control, and transport restrictions.',
      enter: 'Switch(config)# line console 0\nSwitch(config)# line vty 0 15',
      groups: [
        { label: 'Authentication', col: '#dd5544', cmds: [
          ['password <pw>', 'Set line password (used with login)'],
          ['login', 'Require line password'],
          ['login local', 'Use local username database'],
          ['login authentication <list>', 'Use named AAA list'],
          ['no login', 'No authentication — console/lab only'],
        ]},
        { label: 'Session Control', col: '#dd5544', cmds: [
          ['exec-timeout <min> <sec>', 'Idle timeout — 0 0 = never timeout'],
          ['logging synchronous', 'Prevent log messages from breaking typed commands'],
          ['history size <n>', 'Command history buffer size'],
          ['length <lines>', 'Terminal height — 0 disables pagination'],
        ]},
        { label: 'VTY-specific', col: '#dd5544', cmds: [
          ['transport input ssh', 'SSH only — best practice'],
          ['transport input telnet ssh', 'Allow both — less secure'],
          ['transport input none', 'Disable all remote access'],
          ['access-class <acl> in', 'Restrict source IPs allowed to connect'],
        ]},
      ]
    },
    {
      id: 'acl', name: 'Named ACL', prompt: 'Switch(config-std/ext-nacl)#', col: '#ccaa22',
      desc: 'Named ACL on a switch. Applied to SVIs (RACL), VLANs (VACL), or physical ports (PACL).',
      enter: 'Switch(config)# ip access-list extended <name>\nSwitch(config)# ip access-list standard <name>',
      groups: [
        { label: 'ACE Entries', col: '#ccaa22', cmds: [
          ['permit ip <src> <wc> <dst> <wc>', 'Permit IP traffic'],
          ['permit tcp <src> <wc> <dst> <wc> eq <port>', 'Permit TCP to destination port'],
          ['permit udp <src> <wc> <dst> <wc> eq <port>', 'Permit UDP to destination port'],
          ['permit icmp any any', 'Permit ICMP'],
          ['deny ip any any log', 'Deny all — log matches'],
          ['<seq> permit ...', 'Insert entry at specific sequence number'],
          ['no <seq>', 'Delete entry by sequence number'],
          ['remark <text>', 'Add comment line to ACL'],
        ]},
        { label: 'VACL — VLAN ACL (from global config)', col: '#ccaa22', cmds: [
          ['vlan access-map <name> <seq>', 'Create VLAN access-map entry'],
          ['match ip address <acl>', 'Match condition using ACL'],
          ['action forward', 'Forward matching frames'],
          ['action drop', 'Drop matching frames'],
          ['vlan filter <name> vlan-list <ids>', 'Apply access-map to VLANs'],
        ]},
      ]
    },
  ]
}

// ─── Helper: highlight search term ────────────────────────────────────────────

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-cyan-400/30 text-cyan-200 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ─── Helper: format command (highlight <params>) ──────────────────────────────

function FormatCmd({ cmd, query }: { cmd: string; query: string }) {
  const parts = cmd.split(/(<[^>]+>)/)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('<') && part.endsWith('>') ? (
          <span key={i} className="text-cyan-300">{part}</span>
        ) : (
          <span key={i}>{query ? highlight(part, query) : part}</span>
        )
      )}
    </>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CiscoIOSReference() {
  const [dev, setDev] = useState<'router' | 'switch'>('router')
  const [mode, setMode] = useState<string>('overview')
  const [search, setSearch] = useState('')

  const D = dev === 'router' ? ROUTER : SWITCH

  // Search results across all modes
  const searchResults = useMemo(() => {
    if (!search) return []
    const q = search.toLowerCase()
    const results: { modeName: string; modeCol: string; cmd: string; desc: string }[] = []
    D.modes.forEach(m => {
      m.groups.forEach(g => {
        g.cmds.forEach(([cmd, desc]) => {
          if (!desc) return
          if (cmd.toLowerCase().includes(q) || desc.toLowerCase().includes(q)) {
            results.push({ modeName: m.name, modeCol: m.col, cmd, desc })
          }
        })
      })
    })
    return results
  }, [search, D])

  const currentMode = D.modes.find(m => m.id === mode)
  const cmdCount = (m: Mode) => m.groups.reduce((a, g) => a + g.cmds.filter(c => c[1]).length, 0)

  // ── Sidebar ──────────────────────────────────────────────────────────────

  const Sidebar = () => (
    <div className="w-52 flex-shrink-0 bg-slate-800/60 border-r border-slate-700 overflow-y-auto">
      <div className="px-3 py-2 text-xs text-slate-500 uppercase tracking-widest font-mono mt-2">Modes</div>

      {/* Overview */}
      <button
        onClick={() => { setMode('overview'); setSearch('') }}
        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors border-l-2 ${
          mode === 'overview' && !search
            ? 'border-cyan-400 bg-slate-700/50 text-white'
            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
        }`}
      >
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: D.acc }} />
        <span className="text-xs font-mono font-semibold">Overview</span>
      </button>

      {/* Mode buttons */}
      {D.modes.map(m => {
        const isActive = mode === m.id && !search
        return (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setSearch('') }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors border-l-2 ${
              isActive
                ? 'bg-slate-700/50'
                : 'border-transparent hover:bg-slate-700/30'
            }`}
            style={{ borderLeftColor: isActive ? m.col : 'transparent' }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.col }} />
            <div className="min-w-0">
              <div className={`text-xs font-mono font-semibold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {m.name}
              </div>
              <div className="text-[10px] text-slate-600 font-mono truncate">{m.prompt}</div>
            </div>
            <div className="ml-auto text-[10px] text-slate-600 font-mono flex-shrink-0">{cmdCount(m)}</div>
          </button>
        )
      })}
    </div>
  )

  // ── Overview ─────────────────────────────────────────────────────────────

  const Overview = () => (
    <div className="p-6 animate-fade-in-slow">
      <h2 className="text-2xl font-bold font-mono text-white mb-1">
        {dev === 'router' ? '⬡' : '⬢'} Cisco {D.label} — IOS Mode Map
      </h2>
      <p className="text-slate-500 text-xs font-mono mb-8">
        Click any mode to explore its commands. Use the search bar to find commands across all modes.
      </p>

      {/* Flow diagram */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-slate-600 font-mono mb-4">Mode Hierarchy</div>
        <div className="flex flex-wrap items-start gap-0">
          {D.flow.map((fn, i) => {
            const modeData = D.modes.find(m => m.id === fn.id)
            const col = modeData?.col || D.acc
            return (
              <div key={fn.id} className="flex items-start">
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setMode(fn.id)}
                    className="px-3 py-1.5 rounded-md border text-xs font-mono font-bold transition-all hover:brightness-125"
                    style={{ color: col, borderColor: col, background: col + '18' }}
                  >
                    {fn.label}
                  </button>
                  <div className="text-[10px] text-slate-600 font-mono">{fn.prompt}</div>
                  {fn.branches && (
                    <div className="flex flex-col gap-1.5 mt-1">
                      {fn.branches.map(b => {
                        const bc = D.modes.find(m => m.id === b.id)?.col || D.acc
                        return (
                          <button
                            key={b.id}
                            onClick={() => setMode(b.id)}
                            className="flex items-center gap-1.5 group transition-transform hover:translate-x-0.5"
                          >
                            <span className="text-slate-600 text-xs">▸</span>
                            <span
                              className="px-2 py-1 rounded border text-[10px] font-mono font-bold transition-all group-hover:brightness-125"
                              style={{ color: bc, borderColor: bc, background: bc + '18' }}
                            >
                              {b.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
                {i < D.flow.length - 1 && !D.flow[i].branches && (
                  <div className="text-slate-700 text-lg px-2 mt-1.5">→</div>
                )}
                {D.flow[i].branches && i < D.flow.length - 1 && (
                  <div className="text-slate-700 text-lg px-2 mt-1.5">→</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mode cards grid */}
      <div className="text-xs uppercase tracking-widest text-slate-600 font-mono mb-4">All Modes</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {D.modes.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="text-left bg-slate-800/50 border border-slate-700 rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:brightness-110 border-l-[3px]"
            style={{ borderLeftColor: m.col }}
          >
            <div className="text-sm font-bold font-mono mb-0.5" style={{ color: m.col }}>{m.name}</div>
            <div className="text-[10px] text-slate-600 font-mono mb-2">{m.prompt}</div>
            <div className="text-xs text-slate-400 leading-relaxed line-clamp-2">{m.desc}</div>
            <div className="text-[10px] text-slate-600 font-mono mt-2">{cmdCount(m)} commands</div>
          </button>
        ))}
      </div>
    </div>
  )

  // ── Search results ────────────────────────────────────────────────────────

  const SearchResults = () => (
    <div className="p-6 animate-fade-in-slow">
      <div className="mb-5">
        <div className="text-xl font-bold font-mono text-white mb-1">Search results</div>
        <div className="text-xs text-slate-500 font-mono">
          {searchResults.length} command{searchResults.length !== 1 ? 's' : ''} matching &ldquo;{search}&rdquo;
        </div>
      </div>
      {searchResults.length === 0 ? (
        <div className="text-center py-16 text-slate-600 font-mono text-sm">
          No commands matching &ldquo;{search}&rdquo;
        </div>
      ) : (
        <div className="border border-slate-700 rounded-xl overflow-hidden">
          {searchResults.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[minmax(200px,280px)_1fr] border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40 transition-colors"
            >
              <div className="px-4 py-2.5 border-r border-slate-800 font-mono text-xs text-amber-300 break-words">
                <FormatCmd cmd={r.cmd} query={search} />
                <div className="text-[10px] mt-0.5 font-mono" style={{ color: r.modeCol }}>{r.modeName}</div>
              </div>
              <div className="px-4 py-2.5 text-xs text-slate-400 flex items-center">
                {highlight(r.desc, search)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ── Mode detail ───────────────────────────────────────────────────────────

  const ModeDetail = ({ m }: { m: Mode }) => {
    const enterLines = m.enter.split('\n')
    return (
      <div className="p-6 animate-fade-in-slow">
        {/* Header */}
        <div className="flex gap-3 pb-5 border-b border-slate-700 mb-5">
          <div className="w-0.5 rounded-full flex-shrink-0 self-stretch min-h-[44px]" style={{ background: m.col }} />
          <div>
            <div className="text-xl font-bold font-mono text-white">{m.name} Mode</div>
            <div
              className="inline-block font-mono text-xs px-2.5 py-1 rounded border my-1.5"
              style={{ color: m.col, borderColor: m.col, background: m.col + '15' }}
            >
              {m.prompt}
            </div>
            <div className="text-sm text-slate-400 leading-relaxed max-w-xl">{m.desc}</div>
          </div>
        </div>

        {/* How to enter */}
        <div className="bg-slate-800/70 border border-slate-700 rounded-lg px-4 py-3 mb-5">
          <div className="text-[10px] uppercase tracking-widest text-slate-600 font-mono mb-2">How to enter</div>
          {enterLines.map((line, i) => (
            <div key={i} className="font-mono text-xs text-amber-300">
              <FormatCmd cmd={line} query="" />
            </div>
          ))}
        </div>

        {/* Command groups */}
        {m.groups.map(g => {
          const cmds = g.cmds.filter(c => c[1])
          if (!cmds.length) return null
          return (
            <div key={g.label} className="mb-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-1 rounded"
                  style={{ color: g.col, background: g.col + '22' }}
                >
                  {g.label}
                </div>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                {cmds.map(([cmd, desc], i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[minmax(200px,300px)_1fr] border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="px-4 py-2.5 border-r border-slate-800 font-mono text-xs text-amber-300 break-words">
                      <FormatCmd cmd={cmd} query="" />
                    </div>
                    <div className="px-4 py-2.5 text-xs text-slate-400 leading-relaxed flex items-center">
                      {desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/80 border-b border-slate-700 flex-shrink-0 flex-wrap">
        {/* Device toggle */}
        <div className="flex gap-1.5 bg-slate-900 border border-slate-700 rounded-lg p-1">
          <button
            onClick={() => { setDev('router'); setMode('overview'); setSearch('') }}
            className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              dev === 'router'
                ? 'bg-cyan-400 text-slate-900'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            ⬡ Router
          </button>
          <button
            onClick={() => { setDev('switch'); setMode('overview'); setSearch('') }}
            className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              dev === 'switch'
                ? 'bg-emerald-400 text-slate-900'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            ⬢ Switch
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 flex-1 max-w-xs">
          <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search commands…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-xs font-mono text-slate-300 placeholder-slate-600 w-full"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-600 hover:text-slate-400 text-xs">✕</button>
          )}
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {!search && <Sidebar />}

        <div className="flex-1 overflow-y-auto">
          {search ? (
            <SearchResults />
          ) : mode === 'overview' ? (
            <Overview />
          ) : currentMode ? (
            <ModeDetail m={currentMode} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
