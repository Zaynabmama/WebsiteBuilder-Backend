import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';

@Injectable()
export class JSXGeneratorService {
  constructor(private readonly fileService: FileService) {}

  async generateAndSaveJsxFile(components: any[], jsxFilePath: string, pageName: string): Promise<void> {
    const jsxContent = this.generateJsxContent(components, pageName);
    await this.fileService.uploadJsxFile(jsxContent, jsxFilePath);
  }

  generateJsxContent(components: any[], pageName: string): string {
    const componentsJsx = components.map(component => this.generateComponentJsx(component)).join('\n\n');
    return `
      import React from 'react';

      const ${pageName} = () => {
        return (
          <div>
            ${componentsJsx}
          </div>
        );
      }

      export default ${pageName};
    `;
  }

  generateComponentJsx(component: any): string {
    const { type, properties } = component;

    switch (type) {
      case 'navbar':
        return this.generateNavbarJsx(properties);
      case 'footer':
          return this.generateFooterJsx(properties);  
      case 'heroSection':
        return this.generateHeroSectionJsx(properties);
      case 'pricingTable':
        return this.generatePricingCardsJsx(properties);
      case 'card':
        return this.generateCardJsx(properties);
      case 'testimonial':
        return this.generateTestimonialsJsx(properties);
      case 'blogSection':
        return this.generateBlogSectionJsx(properties);
      case 'teamSection':
        return this.generateTeamSectionJsx(properties);
      case 'contactForm':
        return this.generateContactFormJsx(properties);
      case 'service':
          return this.generateServiceJsx(properties);
      default:
        return '<div>Unknown Component</div>';
    }
  }
   generateTeamSectionJsx(properties: any): string {
    const { title, members } = properties;
  
 
    const styles = {
      teamSection: {
        padding: '20px 20px',
        textAlign: 'center',
      },
      teamTitle: {
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '40px',
      },
      memberContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      teamMember: {
        margin: '0 20px',
        textAlign: 'center',
        maxWidth: '300px',
      },
      teamMemberPhoto: {
        width: '100%',
        height: 'auto',
        borderRadius: '10px',
      },
      teamMemberName: {
        fontSize: '1.5rem',

        margin: '10px 0 5px',
      },
      teamMemberPosition: {
        fontSize: '1.1rem',
        color: '#666',
      },
      teamMemberDescription: {
        fontSize: '0.9rem',
        color: '#555',
        marginTop: '10px',
      },
    };
  
    return `
      <section style={${JSON.stringify(styles.teamSection)}}>
        <h2 style={${JSON.stringify(styles.teamTitle)}}>${title}</h2>
        <div style={${JSON.stringify(styles.memberContainer)}}>
          ${members
            .map(
              (member: any) => `
              <div style={${JSON.stringify(styles.teamMember)}}>
                <img 
                  src="${member.photoUrl}" 
                  alt="${member.name}" 
                  style={${JSON.stringify(styles.teamMemberPhoto)}} 
                />
                <h3 style={${JSON.stringify(styles.teamMemberName)}}>${member.name}</h3>
                <p style={${JSON.stringify(styles.teamMemberPosition)}}>${member.position}</p>
                <p style={${JSON.stringify(styles.teamMemberDescription)}}>${member.description}</p>
              </div>
            `
            )
            .join('')}
        </div>
      </section>
    `;
            }  
  generateServiceJsx(properties: any): string {
    const { backgroundColor, color, services, flexDirection, justifyContent, alignItems } = properties;
  
    const servicesJsx = services.map((service: any) => `
      <div className="serviceCard" style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        border: '1px solid #ddd',
        padding: '20px',
        width: 'calc(33.333% - 20px)',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}>
        <h3 className="serviceTitle" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}>${service.title}</h3>
        <p className="serviceDescription" style={{
          fontSize: '1rem',
          marginBottom: '15px',
          color: '#666',
        }}>${service.description}</p>
        <ul className="serviceFeatures" style={{
          listStyle: 'none',
          padding: '0',
          margin: '0',
        }}>
          ${service.features.map(feature => `
            <li className="serviceFeature" style={{
              padding: '5px 0',
              position: 'relative',
            }}>
              <span style={{
                color: '#4A90E2',
                position: 'absolute',
                left: '-20px',
              }}>✔️</span>
              ${feature}
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  
    return `
      <div className="serviceContainer" style={{
        backgroundColor: '${backgroundColor}',
        color: '${color}',
        display: 'flex',
        flexDirection: '${flexDirection}',
        justifyContent: '${justifyContent}',
        alignItems: '${alignItems}',
        padding: '20px',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        ${servicesJsx}
      </div>
    `;
  }
  
  
  generateNavbarJsx(properties: any): string {
    const { backgroundColor, color, logo, links, flexDirection, justifyContent, alignItems } = properties;
    const linksJsx = links.map((link: any) => `<a href="${link.href}" style={{ color: '${color}' }}>${link.name}</a>`).join('\n');
    return `
      <nav style={{
        backgroundColor: '${backgroundColor}', 
        color: '${color}', 
        display: 'flex', 
        flexDirection: '${flexDirection}', 
        justifyContent: '${justifyContent}', 
        alignItems: '${alignItems}', 
        padding: '10px'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', marginRight: 'auto' }}>
          ${logo}
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          ${linksJsx}
        </div>
      </nav>
    `;
  }
  generateFooterJsx(properties: any): string {
    const { backgroundColor, color, links } = properties;
  
    return `
      <footer style={{
        backgroundColor: '${backgroundColor}',
        color: '${color}',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px'
        }}>
          ${links.map(link => `
            <a href="${link.href}" style={{
              color: '${color}',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              ${link.text}
            </a>
          `).join('')}
        </div>
      </footer>
    `;
  }
  


   generateHeroSectionJsx(properties: any): string {
    const {
      backgroundColor = '#4A90E2',
      title = 'Welcome!',
      subtitle = '',
      buttonText = 'Learn More',
      buttonColor = '#0070f3',
      onClick = 'alert("Button clicked!")'
    } = properties;
  
    return `
      <section style={{
        backgroundColor: '${backgroundColor}',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        textAlign: 'center',
        padding: '100px 20px',
        position: 'relative'
      }}>
        <div style={{ padding: '50px' }}>
          <h1>${title}</h1>
          <p>${subtitle}</p>
          <button onClick={() => ${onClick}} style={{
            backgroundColor: '${buttonColor}',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            ${buttonText}
          </button>
        </div>
      </section>
    `;
        }  
        generatePricingCardsJsx(properties: any): string {
          const { color, title, cards } = properties;
        
          const cardJsx = cards.map((card: any) => `
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '5px',
              padding: '15px',
              flex: '1 1 30%',
              margin: '10px',
              boxShadow: 'none',
              textAlign: 'left',
            }}>
              <h3 style={{ margin: '5px 0' }}>${card.title}</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${card.price}</p>
              <p style={{ marginBottom: '10px' }}>${card.description}</p>
              <ul style={{
                listStyleType: 'none',
                padding: 0,
                margin: '10px 0',
              }}>
                ${card.features.map((feature: string) => `
                  <li style={{ margin: '5px 0' }}>• ${feature}</li>
                `).join('')}
              </ul>
              <a href="${card.buttonHref}" style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '5px',
                textDecoration: 'none',
                fontWeight: 'bold',
                border: '1px solid #ddd',
                color: '#333',
              }}>
                ${card.buttonText}
              </a>
            </div>
          `).join('');
        
          return `
            <section style={{
              
              color: '${color}',
              padding: '20px',
              textAlign: 'center',
            }}>
              <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>${title}</h2>
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
               
              }}>
                ${cardJsx}
              </div>
            </section>
          `;
        }
 
  generateSingleCardJsx(card: any, backgroundColor: string, color: string): string {
    const { title: cardTitle = 'Untitled Plan', price = 'Free', features = ['No features'], buttonText = 'Sign Up', signUpHref = '#', buttonColor = '#007bff' } = card;
    return `
      <div style={{
        backgroundColor: '${backgroundColor}', 
        color: '${color}', 
        borderRadius: '10px', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
        padding: '20px', 
        textAlign: 'center', 
        maxWidth: '300px', 
        margin: '10px'
      }}>
        <h3>${cardTitle}</h3>
        <h4>${price}</h4>
        <p>${features.join(', ')}</p>
        <button onClick={() => window.location.href='${signUpHref}'} style={{
          backgroundColor: '${buttonColor}',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          ${buttonText}
        </button>
      </div>
    `;
  }

  generateCardJsx(properties: any): string {
    const { backgroundColor = '#fff', color = '#000', title = 'Card Title', subtitle = 'Card Subtitle', content = '', buttonText = 'Click Me' } = properties;
    return `
      <div style={{
        backgroundColor: '${backgroundColor}', 
        color: '${color}', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
        textAlign: 'center', 
        margin: '20px'
      }}>
        <h3>${title}</h3>
        <h4>${subtitle}</h4>
        <p>${content}</p>
        <button style={{
          backgroundColor: '#007bff', 
          color: '#fff', 
          padding: '10px 20px', 
          borderRadius: '5px', 
          border: 'none', 
          cursor: 'pointer'
        }}>
          ${buttonText}
        </button>
      </div>
    `;
  }

 
  generateTestimonialsJsx(properties: any): string {
    const { color, title, testimonials, flexDirection, justifyContent, alignItems } = properties;
    const testimonialsJsx = testimonials.map((testimonial: { name: string, position: string, text: string }, index: number) => `
      <div key={${index}} style={{
       
        borderRadius: '10px',
        border: '1px solid #ddd',
        padding: '20px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        margin: '0 20px'
      }}>
        <h3 style={{ margin: '0 0 10px' }}>{${JSON.stringify(testimonial.name)}}</h3>
        <h4 style={{ margin: '0 0 15px', fontWeight: 'normal', color: '#666' }}>{${JSON.stringify(testimonial.position)}}</h4>
        <p>{${JSON.stringify(testimonial.text)}}</p>
      </div>
    `).join('\n');

    return `
      <section style={{
        color: '${color}',
        display: 'flex',
        flexDirection: '${flexDirection}',
        justifyContent: '${justifyContent}',
        alignItems: '${alignItems}',
        padding: '20px',
    
      }}>
        ${title ? `<h2 style={{ marginBottom: '20px' }}>${title}</h2>` : ''}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
        }}>
          ${testimonialsJsx}
        </div>
      </section>
    `;
  }


  generateSingleTestimonialJsx(testimonial: any): string {
    const { name, feedback } = testimonial;
    return `
      <blockquote>
        <p>"${feedback}"</p>
        <footer>- ${name}</footer>
      </blockquote>
    `;
  }


  generateBlogSectionJsx(properties: any): string {
    const { posts = [] } = properties;
    return `
      <div style={{ padding: '20px' }}>
        <h2>Latest Blog Posts</h2>
        <ul>
          ${posts.map((post: any) => `<li><a href="${post.href}">${post.title}</a>: ${post.excerpt}</li>`).join('')}
        </ul>
      </div>
    `;
  }

 

  generateContactFormJsx(properties: any): string {
    const { submitUrl = '#' } = properties;
    return `
    <section style={{
      backgroundColor,
      color,
      padding: '50px 20px',
      textAlign: 'center',
    }}>
      <h2>Contact Us</h2>
      <form style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
        marginTop: '30px',
      }}>
        <input type="text" placeholder={placeholderName} style={{
          padding: '10px',
          width: '300px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }} />
        <input type="email" placeholder={placeholderEmail} style={{
          padding: '10px',
          width: '300px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }} />
        <textarea placeholder={placeholderMessage} rows={5} style={{
          padding: '10px',
          width: '300px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}></textarea>
        <button type="submit" style={{
          backgroundColor: '#0070f3',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}>
          {submitButtonText}
        </button>
      </form>
    </section>
    `;
  }
}
