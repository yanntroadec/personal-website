'use client'

import BlogArticle, { Section, Paragraph, CodeBlock, InlineCode, List, Alert } from '../../../components/BlogArticle'
import Link from 'next/link'

/**
 * Cisco IOS Fundamentals Article Page
 *
 * Comprehensive guide on Cisco IOS fundamentals and advanced techniques.
 * Covers navigation, configuration modes, and command-line mastery.
 */
export default function CiscoIOSFundamentals() {
  return (
    <BlogArticle
      title="Cisco IOS Fundamentals and Advanced Techniques"
      date="2025-11-16"
      readTime="10 min read"
    >
      {/* Introduction */}
      <Section>
        <Paragraph>
          Cisco IOS (Internetwork Operating System) is the software platform that powers Cisco routers
          and switches. Understanding IOS fundamentals is essential for any network engineer. This guide
          will take you from basic navigation to advanced command-line techniques, providing you with
          the skills needed to efficiently configure and manage Cisco devices.
        </Paragraph>
      </Section>

      {/* IOS Modes */}
      <Section title="Understanding IOS Modes">
        <Paragraph>
          Cisco IOS operates in different modes, each with specific commands and privileges. Mastering
          these modes is fundamental to efficient device management:
        </Paragraph>
        <List items={[
          'User EXEC Mode: Basic monitoring commands, limited access (Router>)',
          'Privileged EXEC Mode: Full access to show commands and device management (Router#)',
          'Global Configuration Mode: Device-wide configuration commands (Router(config)#)',
          'Interface Configuration Mode: Interface-specific settings (Router(config-if)#)',
          'Line Configuration Mode: Console, VTY, and AUX line configuration (Router(config-line)#)',
          'Router Configuration Mode: Routing protocol configuration (Router(config-router)#)'
        ]} />
      </Section>

      {/* Navigating Between Modes */}
      <Section title="Navigating Between Modes">
        <Paragraph>
          <strong>Entering Privileged EXEC Mode</strong>
        </Paragraph>
        <CodeBlock language="cisco">
{`Router> enable
Router#`}
        </CodeBlock>

        <Paragraph>
          <strong>Entering Global Configuration Mode</strong>
        </Paragraph>
        <CodeBlock language="cisco">
{`Router# configure terminal
Router(config)#`}
        </CodeBlock>

        <Paragraph>
          <strong>Entering Interface Configuration Mode</strong>
        </Paragraph>
        <CodeBlock language="cisco">
{`Router(config)# interface gigabitethernet 0/0
Router(config-if)#`}
        </CodeBlock>

        <Paragraph>
          <strong>Returning to Previous Mode</strong>
        </Paragraph>
        <CodeBlock language="cisco">
{`Router(config-if)# exit
Router(config)# exit
Router#`}
        </CodeBlock>

        <Alert type="info">
          Use <InlineCode>end</InlineCode> or press <InlineCode>Ctrl+Z</InlineCode> to return directly
          to privileged EXEC mode from any configuration mode.
        </Alert>
      </Section>

      {/* Essential Show Commands */}
      <Section title="Essential Show Commands">
        <Paragraph>
          Show commands are crucial for monitoring and troubleshooting. Here are the most important ones:
        </Paragraph>
        <CodeBlock language="cisco">
{`! Display running configuration
Router# show running-config

! Display startup configuration
Router# show startup-config

! Show interface status and statistics
Router# show ip interface brief
Router# show interfaces gigabitethernet 0/0

! Display routing table
Router# show ip route

! Show version and hardware information
Router# show version

! Display ARP table
Router# show arp

! View current users and sessions
Router# show users`}
        </CodeBlock>
      </Section>

      {/* Configuration Management */}
      <Section title="Configuration Management">
        <Paragraph>
          Properly managing configurations is critical for network stability and disaster recovery.
        </Paragraph>

        <Paragraph>
          <strong>Saving Configuration</strong>
        </Paragraph>
        <CodeBlock language="cisco">
{`! Save running-config to startup-config
Router# copy running-config startup-config
Router# write memory
Router# wr

! Backup to TFTP server
Router# copy running-config tftp:
Address or name of remote host []? 192.168.1.100
Destination filename [router-confg]? backup-config.txt`}
        </CodeBlock>

        <Paragraph>
          <strong>Restoring Configuration</strong>
        </Paragraph>
        <CodeBlock language="cisco">
{`! Restore from startup-config
Router# copy startup-config running-config

! Restore from TFTP
Router# copy tftp: running-config`}
        </CodeBlock>

        <Alert type="warning">
          Always verify configurations with <InlineCode>show running-config</InlineCode> before saving
          to prevent locking yourself out of the device.
        </Alert>
      </Section>

      {/* Advanced CLI Techniques */}
      <Section title="Advanced CLI Techniques">
        <Paragraph>
          <strong>Command History and Editing</strong>
        </Paragraph>
        <List items={[
          'Up/Down arrows: Navigate through command history',
          'Ctrl+A: Move cursor to beginning of line',
          'Ctrl+E: Move cursor to end of line',
          'Ctrl+W: Delete word before cursor',
          'Ctrl+U: Delete entire line',
          'Tab: Auto-complete commands and keywords'
        ]} />

        <Paragraph>
          <strong>Command Abbreviation</strong>
        </Paragraph>
        <Paragraph>
          IOS allows command abbreviation as long as it's unique:
        </Paragraph>
        <CodeBlock language="cisco">
{`Router# conf t          (configure terminal)
Router(config)# int gi0/0  (interface gigabitethernet0/0)
Router(config-if)# sh ip int br (show ip interface brief)`}
        </CodeBlock>

        <Paragraph>
          <strong>Using Filters</strong>
        </Paragraph>
        <CodeBlock language="cisco">
{`! Show only lines containing "interface"
Router# show running-config | include interface

! Show lines beginning with "interface"
Router# show running-config | begin interface

! Exclude lines containing "!"
Router# show running-config | exclude !

! Section filtering
Router# show running-config | section interface GigabitEthernet0/0`}
        </CodeBlock>

        <Paragraph>
          <strong>Do Command</strong>
        </Paragraph>
        <Paragraph>
          Execute privileged EXEC commands from any configuration mode using the <InlineCode>do</InlineCode> prefix:
        </Paragraph>
        <CodeBlock language="cisco">
{`Router(config)# do show ip interface brief
Router(config-if)# do show running-config interface gigabitethernet 0/0`}
        </CodeBlock>
      </Section>

      {/* Context-Sensitive Help */}
      <Section title="Context-Sensitive Help">
        <Paragraph>
          IOS provides excellent built-in help functionality:
        </Paragraph>
        <CodeBlock language="cisco">
{`! List all available commands in current mode
Router# ?

! Show commands beginning with "sh"
Router# sh?

! Show command syntax and parameters
Router# show ?

! Show available options at cursor position
Router(config-if)# ip address ?`}
        </CodeBlock>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <List items={[
          'Always use meaningful hostnames for easier identification',
          'Configure banners to display legal warnings and contact information',
          'Use "do show running-config" frequently to verify changes',
          'Save configurations immediately after making critical changes',
          'Document all configuration changes with comments when possible',
          'Use "reload in 10" before making risky changes to auto-revert if locked out',
          'Enable logging to track configuration changes and issues',
          'Create configuration templates for standardization across devices'
        ]} />
      </Section>

      {/* Common Configuration Tasks */}
      <Section title="Common Configuration Tasks">
        <Paragraph>
          <strong>Setting Hostname and Domain</strong>
        </Paragraph>
        <CodeBlock language="cisco">
{`Router(config)# hostname EDGE-RTR-01
EDGE-RTR-01(config)# ip domain-name company.local`}
        </CodeBlock>

        <Paragraph>
          <strong>Configuring Console and VTY Lines</strong>
        </Paragraph>
        <CodeBlock language="cisco">
{`! Console line configuration
EDGE-RTR-01(config)# line console 0
EDGE-RTR-01(config-line)# logging synchronous
EDGE-RTR-01(config-line)# exec-timeout 15 0
EDGE-RTR-01(config-line)# exit

! VTY lines for remote access
EDGE-RTR-01(config)# line vty 0 4
EDGE-RTR-01(config-line)# transport input ssh
EDGE-RTR-01(config-line)# login local
EDGE-RTR-01(config-line)# exec-timeout 15 0
EDGE-RTR-01(config-line)# exit`}
        </CodeBlock>

        <Paragraph>
          <strong>Configuring Time and NTP</strong>
        </Paragraph>
        <CodeBlock language="cisco">
{`! Set timezone
EDGE-RTR-01(config)# clock timezone EST -5
EDGE-RTR-01(config)# clock summer-time EDT recurring

! Configure NTP
EDGE-RTR-01(config)# ntp server 192.168.1.1
EDGE-RTR-01(config)# ntp update-calendar`}
        </CodeBlock>
      </Section>

      {/* Conclusion */}
      <Section title="Conclusion">
        <Paragraph>
          Mastering Cisco IOS fundamentals is the foundation for becoming an effective network engineer.
          The techniques covered in this guide—from basic navigation to advanced CLI shortcuts—will
          significantly improve your efficiency when working with Cisco devices. Practice these commands
          regularly, and they'll become second nature. In upcoming articles, we'll build on these
          fundamentals to explore specific technologies like routing protocols, VLANs, and security features.
        </Paragraph>
      </Section>

      {/* Back to blog link */}
      <div className="mt-12 pt-6 border-t border-slate-700/50">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm transition-colors duration-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
      </div>
    </BlogArticle>
  )
}
