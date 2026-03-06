'use client'

import BlogArticle, { Section, Paragraph, CodeBlock, InlineCode, List, Alert } from '../../../components/BlogArticle'
import Link from 'next/link'

/**
 * SSH Configuration Article Page
 * 
 * Comprehensive guide on configuring and securing SSH access on Cisco devices.
 * Covers basic setup, hardening techniques, and production best practices.
 */
export default function SshConfiguration() {
  return (
    <BlogArticle 
      title="Cisco SSH Deep Dive: How to Secure, Configure, and Harden Remote Access"
      date="2025-11-01"
      readTime="8 min read"
    >
      {/* Introduction */}
      <Section>
        <Paragraph>
          Securing network devices is fundamental to maintaining a robust infrastructure. 
          SSH (Secure Shell) provides encrypted remote access to Cisco devices, replacing the 
          insecure Telnet protocol. In this guide, we'll explore comprehensive SSH configuration 
          and hardening techniques.
        </Paragraph>
      </Section>

      {/* Prerequisites section */}
      <Section title="Prerequisites">
        <Paragraph>
          Before configuring SSH on your Cisco device, ensure you have:
        </Paragraph>
        <List items={[
          'A Cisco router or switch with an IOS image that supports SSH',
          'Console or existing administrative access to the device',
          'Basic understanding of Cisco IOS command-line interface',
          'A hostname configured on the device'
        ]} />
      </Section>

      {/* Basic configuration steps */}
      <Section title="Basic SSH Configuration">
        <Paragraph>
          Let's start with the fundamental steps to enable SSH on a Cisco device:
        </Paragraph>

        {/* Step 1: Hostname and domain */}
        <Paragraph>
          <strong>Step 1: Set the hostname and domain name</strong>
        </Paragraph>
        <CodeBlock language="cisco-ios">{`Router(config)# hostname R1
R1(config)# ip domain-name example.com`}</CodeBlock>

        {/* Step 2: RSA key generation */}
        <Paragraph>
          <strong>Step 2: Generate RSA keys</strong>
        </Paragraph>
        <CodeBlock language="cisco-ios">{`R1(config)# crypto key generate rsa modulus 2048

The name for the keys will be: R1.example.com
% The key modulus size is 2048 bits
% Generating 2048 bit RSA keys, keys will be non-exportable...
[OK] (elapsed time was 3 seconds)`}</CodeBlock>

        <Alert type="info">
          Using a 2048-bit modulus provides strong encryption. For enhanced security 
          in sensitive environments, consider 4096-bit keys, though key generation will take longer.
        </Alert>

        {/* Step 3: User account creation */}
        <Paragraph>
          <strong>Step 3: Create a local user account</strong>
        </Paragraph>
        <CodeBlock language="cisco-ios">{`R1(config)# username admin privilege 15 secret YourStrongPassword123!`}</CodeBlock>

        {/* Step 4: VTY line configuration */}
        <Paragraph>
          <strong>Step 4: Configure VTY lines for SSH</strong>
        </Paragraph>
        <CodeBlock language="cisco-ios">{`R1(config)# line vty 0 4
R1(config-line)# transport input ssh
R1(config-line)# login local
R1(config-line)# exit`}</CodeBlock>
      </Section>

      {/* Security hardening section */}
      <Section title="Hardening SSH Access">
        <Paragraph>
          Basic configuration is just the start. Let's implement security best practices:
        </Paragraph>

        {/* SSH version 2 enforcement */}
        <Paragraph>
          <strong>Enable SSH version 2 only</strong>
        </Paragraph>
        <CodeBlock language="cisco-ios">{`R1(config)# ip ssh version 2`}</CodeBlock>

        <Alert type="warning">
          SSH version 1 has known security vulnerabilities. Always use version 2 in production environments.
        </Alert>

        {/* Timeout and retry configuration */}
        <Paragraph>
          <strong>Set SSH timeout and authentication retries</strong>
        </Paragraph>
        <CodeBlock language="cisco-ios">{`R1(config)# ip ssh time-out 60
R1(config)# ip ssh authentication-retries 3`}</CodeBlock>

        {/* Access control lists */}
        <Paragraph>
          <strong>Implement access control with ACLs</strong>
        </Paragraph>
        <CodeBlock language="cisco-ios">{`R1(config)# access-list 10 permit 192.168.1.0 0.0.0.255
R1(config)# access-list 10 deny any log
R1(config)# line vty 0 4
R1(config-line)# access-class 10 in`}</CodeBlock>

        <Paragraph>
          This configuration restricts SSH access to devices on the 192.168.1.0/24 network 
          and logs any denied attempts for security monitoring.
        </Paragraph>
      </Section>

      {/* Advanced configuration options */}
      <Section title="Advanced Configuration">
        {/* Source interface configuration */}
        <Paragraph>
          <strong>Configure source interface for SSH</strong>
        </Paragraph>
        <CodeBlock language="cisco-ios">{`R1(config)# ip ssh source-interface Loopback0`}</CodeBlock>

        <Paragraph>
          Using a loopback interface ensures SSH connections remain reachable even if 
          physical interfaces go down, improving management reliability.
        </Paragraph>

        {/* Logging configuration */}
        <Paragraph>
          <strong>Enable logging for security auditing</strong>
        </Paragraph>
        <CodeBlock language="cisco-ios">{`R1(config)# login on-failure log
R1(config)# login on-success log`}</CodeBlock>
      </Section>

      {/* Verification commands */}
      <Section title="Verification Commands">
        <Paragraph>
          After configuration, verify your SSH setup with these commands:
        </Paragraph>

        <CodeBlock language="cisco-ios">{`R1# show ip ssh
R1# show ssh
R1# show crypto key mypubkey rsa
R1# show line vty 0 4`}</CodeBlock>

        <Paragraph>
          These commands display SSH version, active sessions, RSA keys, and VTY line configuration respectively.
        </Paragraph>
      </Section>

      {/* Best practices list */}
      <Section title="Security Best Practices">
        <List 
          ordered={true}
          items={[
            'Always use strong, unique passwords for each device',
            'Regularly rotate passwords and SSH keys',
            'Implement AAA (Authentication, Authorization, and Accounting) for centralized user management',
            'Use ACLs to restrict SSH access to known management networks',
            'Enable logging and regularly review authentication logs',
            'Keep IOS firmware updated to patch security vulnerabilities',
            'Consider implementing port security and DHCP snooping for additional layer 2 protection'
          ]} 
        />
      </Section>

      {/* Troubleshooting guide */}
      <Section title="Troubleshooting">
        <Paragraph>
          Common SSH issues and solutions:
        </Paragraph>

        <Paragraph>
          <strong>Connection refused:</strong> Verify that SSH is enabled with <InlineCode>show ip ssh</InlineCode> 
          and check if the VTY lines are configured correctly.
        </Paragraph>

        <Paragraph>
          <strong>Authentication failed:</strong> Ensure local user accounts are properly configured 
          and <InlineCode>login local</InlineCode> is set on VTY lines.
        </Paragraph>

        <Paragraph>
          <strong>RSA key generation fails:</strong> Verify that both hostname and domain name are 
          configured before generating keys.
        </Paragraph>
      </Section>

      {/* Conclusion */}
      <Section title="Conclusion">
        <Paragraph>
          Proper SSH configuration is essential for secure network device management. By following 
          these guidelines, you've implemented a robust SSH setup that protects your infrastructure 
          while maintaining administrative access. Remember to regularly review and update your 
          security configurations as threats evolve.
        </Paragraph>

        <Alert type="success">
          You now have a production-ready SSH configuration that follows industry best practices 
          for securing Cisco network devices.
        </Alert>
      </Section>

      {/* Back to blog navigation */}
      <div className="mt-16 pt-8 border-t border-slate-700/50">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-3 px-6 py-3 rounded-lg border-2 border-slate-700 bg-slate-900/50 hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
        >
          {/* Arrow icon */}
          <svg 
            className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300 group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          
          {/* Link text */}
          <span className="font-mono text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
            Back to Blog
          </span>
        </Link>
      </div>
    </BlogArticle>
  )
}
