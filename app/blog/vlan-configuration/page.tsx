'use client'

import BlogArticle, { Section, Paragraph, CodeBlock, InlineCode, List, Alert } from '../../../components/BlogArticle'
import Link from 'next/link'

/**
 * VLAN Configuration Article Page
 *
 * Comprehensive guide on configuring VLANs on Cisco switches.
 * Covers VLAN basics, trunking, and inter-VLAN routing.
 */
export default function VlanConfiguration() {
  return (
    <BlogArticle
      title="VLAN Configuration Essentials: Segmenting Your Network"
      date="2025-11-17"
      readTime="6 min read"
    >
      {/* Introduction */}
      <Section>
        <Paragraph>
          Virtual Local Area Networks (VLANs) are a fundamental technology for network segmentation.
          They allow you to logically divide a physical network into multiple broadcast domains,
          improving security, performance, and management. In this guide, we'll explore how to
          configure VLANs on Cisco switches.
        </Paragraph>
      </Section>

      {/* What are VLANs section */}
      <Section title="What are VLANs?">
        <Paragraph>
          A VLAN is a logical grouping of devices within the same broadcast domain, regardless
          of their physical location. Key benefits include:
        </Paragraph>
        <List items={[
          'Improved security through network segmentation',
          'Better performance by reducing broadcast traffic',
          'Simplified network management and troubleshooting',
          'Flexibility in network design and device placement'
        ]} />
      </Section>

      {/* Basic VLAN Configuration */}
      <Section title="Creating VLANs">
        <Paragraph>
          <strong>Step 1: Create a VLAN</strong>
        </Paragraph>
        <Paragraph>
          To create a VLAN, enter global configuration mode and use the <InlineCode>vlan</InlineCode> command:
        </Paragraph>
        <CodeBlock language="cisco">
{`Switch(config)# vlan 10
Switch(config-vlan)# name SALES
Switch(config-vlan)# exit

Switch(config)# vlan 20
Switch(config-vlan)# name ENGINEERING
Switch(config-vlan)# exit`}
        </CodeBlock>

        <Paragraph>
          <strong>Step 2: Assign ports to VLANs</strong>
        </Paragraph>
        <Paragraph>
          After creating VLANs, assign switch ports to them:
        </Paragraph>
        <CodeBlock language="cisco">
{`Switch(config)# interface range fastethernet 0/1 - 10
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10
Switch(config-if-range)# exit

Switch(config)# interface range fastethernet 0/11 - 20
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20
Switch(config-if-range)# exit`}
        </CodeBlock>
      </Section>

      {/* Trunk Configuration */}
      <Section title="Configuring Trunk Ports">
        <Paragraph>
          Trunk ports carry traffic for multiple VLANs between switches. Configure a trunk port
          with the following commands:
        </Paragraph>
        <CodeBlock language="cisco">
{`Switch(config)# interface gigabitethernet 0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20
Switch(config-if)# exit`}
        </CodeBlock>
        <Alert type="warning">
          Always specify which VLANs are allowed on trunk ports to minimize security risks and
          reduce unnecessary traffic.
        </Alert>
      </Section>

      {/* Verification */}
      <Section title="Verifying VLAN Configuration">
        <Paragraph>
          Use these commands to verify your VLAN configuration:
        </Paragraph>
        <CodeBlock language="cisco">
{`Switch# show vlan brief
Switch# show interfaces trunk
Switch# show interfaces fastethernet 0/1 switchport`}
        </CodeBlock>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <List items={[
          'Always change the native VLAN from VLAN 1 for security',
          'Use descriptive VLAN names for easier management',
          'Document your VLAN assignments and IP schemes',
          'Disable unused ports and assign them to an unused VLAN',
          'Implement Voice VLANs for IP phones to separate voice and data traffic'
        ]} />
      </Section>

      {/* Conclusion */}
      <Section title="Conclusion">
        <Paragraph>
          VLANs are a powerful tool for network segmentation and management. By properly
          configuring VLANs and trunk ports, you can create a more secure, efficient, and
          manageable network infrastructure. In the next article, we'll explore inter-VLAN
          routing techniques.
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
