import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Asset Manager';
  newAsset = {
    name: '',
    value: 0
  };
  assets: { name: string; value: number }[] = [];
  searchTerm: string = '';
  isModalOpen = false;
  selectedIndex: number | null = null;

  ngOnInit() {
    const savedData = localStorage.getItem('assets');
    if (savedData) {
      this.assets = JSON.parse(savedData); // Load saved assets from localStorage
    }
    this.updatePieChart(); // Load initial pie chart
  }

  // Add new asset
  addAsset() {
    if (this.newAsset.name && this.newAsset.value) {
      this.assets.push({ ...this.newAsset });
      this.saveToLocalStorage();
      this.newAsset = { name: '', value: 0 }; // Reset input fields
      this.updatePieChart(); // Update pie chart after adding asset
    }
  }

  // Save assets to localStorage
  saveToLocalStorage() {
    localStorage.setItem('assets', JSON.stringify(this.assets));
  }

  // Update Pie Chart
  updatePieChart() {
    const assetNames = this.assets.map(asset => asset.name);
    const assetValues = this.assets.map(asset => asset.value);

    new Chart('canvas', {
      type: 'pie',
      data: {
        labels: assetNames, // Use asset names for pie chart labels
        datasets: [
          {
            label: 'Asset Values',
            data: assetValues, // Use asset values for the pie chart data
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Customize colors
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  // Open delete confirmation modal
  openDeleteModal(index: number) {
    this.selectedIndex = index;
    this.isModalOpen = true;
  }

  // Close delete confirmation modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Confirm delete and remove asset
  confirmDelete() {
    if (this.selectedIndex !== null) {
      this.assets.splice(this.selectedIndex, 1);
      this.selectedIndex = null;
      this.isModalOpen = false; // Close modal after deletion
      this.saveToLocalStorage();
      this.updatePieChart(); // Update pie chart after deletion
    }
  }

  // Filter assets based on search term
  filteredData() {
    return this.assets.filter((asset) =>
      asset.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Function to update asset details
  updateAsset(index: number) {
    const assetToUpdate = this.assets[index];

    // Set the input fields to the selected asset's values
    this.newAsset.name = assetToUpdate.name;
    this.newAsset.value = assetToUpdate.value;

    // Now remove the asset from the list, so we can replace it with the updated one
    this.assets.splice(index, 1);
    this.saveToLocalStorage();
    this.updatePieChart(); // Update the chart after the update
  }
}
