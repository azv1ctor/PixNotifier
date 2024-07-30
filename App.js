import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { Buffer } from 'buffer';

const config = {
  user: 'joaovictoralvesazevedo@gmail.com',
  password: '84153703cC!',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  authTimeout: 3000,
};

const fetchEmails = async (setEmails) => {
  const imap = new Imap(config);

  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  imap.once('ready', () => {
    openInbox((err, box) => {
      if (err) throw err;
      imap.search(['UNSEEN'], (err, results) => {
        if (err) throw err;
        const f = imap.fetch(results, { bodies: '' });

        f.on('message', (msg, seqno) => {
          msg.on('body', async (stream, info) => {
            let email = '';
            stream.on('data', (chunk) => {
              email += chunk.toString('utf8');
            });
            stream.once('end', async () => {
              const parsed = await simpleParser(email);
              setEmails((prevEmails) => [
                ...prevEmails,
                {
                  subject: parsed.subject,
                  from: parsed.from.text,
                  date: parsed.date,
                },
              ]);
            });
          });
        });

        f.once('error', (err) => {
          console.error('Fetch error: ' + err);
        });

        f.once('end', () => {
          imap.end();
        });
      });
    });
  });

  imap.once('error', (err) => {
    console.error(err);
  });

  imap.once('end', () => {
    console.log('Connection ended');
  });

  imap.connect();
};

const App = () => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    fetchEmails(setEmails);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.header}>Email Notifications</Text>
        {emails.map((email, index) => (
          <View key={index} style={styles.emailItem}>
            <Text>Subject: {email.subject}</Text>
            <Text>From: {email.from}</Text>
            <Text>Date: {email.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emailItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default App;
