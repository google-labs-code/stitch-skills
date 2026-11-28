import 'package:flutter/material.dart';

class StitchPage extends StatefulWidget {
  const StitchPage({super.key});

  @override
  State<StitchPage> createState() => _StitchPageState();
}

class _StitchPageState extends State<StitchPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Stitch Component'),
      ),
      body: const Center(
        child: Text('Generate content here'),
      ),
    );
  }
}
